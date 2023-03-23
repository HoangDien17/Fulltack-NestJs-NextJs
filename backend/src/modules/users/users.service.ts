import { Injectable, BadRequestException } from '@nestjs/common';
import { ICreateUser, IResetPassword, IUsers, IUserLog } from './users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, InsertResult, Between } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import MailService from '../mails/mail.service';
import { SHA256 } from 'crypto-js';
import { render } from 'ejs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { USER_STATUS } from '../../utils/enum';
import { CONSTANTS } from '../../utils/constants';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly i18n: I18nService
  ) {}

  async createUser(data: ICreateUser): Promise<IUsers> {
    const user = await this.repo.findOne({ where: { email: data.email } });
    if (user) {
      throw new BadRequestException(this.i18n.translate('messages.EMAIL_EXISTED'));
    }
    const password = await bcrypt.hash(data.password, 10);

    const userSave = await this.repo.insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password,
      register_token: data.register_token
    });

    return {
      id: userSave.raw[0]?.id,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      is_active: userSave.raw[0]?.is_active
    };
  }

  async findByCondition(conditions: Record<string, any>): Promise<IUsers> {
    return this.repo.findOne({ where: conditions });
  }

  async updateUser(id: number, data: Partial<IUsers>): Promise<UpdateResult> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    return this.repo.update({ id }, data);
  }

  async preResetPassword(email: string) {
    const user = await this.repo.findOne({ where: { email, is_active: USER_STATUS.ACTIVATED } });
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    const resetPasswordToken = SHA256(`${email}${new Date()}`).toString();

    await this.updateUser(user.id, { reset_password_at: new Date(), reset_password_token: resetPasswordToken });

    // Send email
    const url = `${this.configService.get('backendUrl')}/users/confirm-reset-password?token=${resetPasswordToken}`;
    const template = await readFileSync(resolve(__dirname + './../../../templates/reset_password.ejs'), 'utf-8');
    const html = render(template, { url, first_name: user.first_name, last_name: user.last_name });
    this.mailService.sendMail({
      to: user.email,
      text: 'Click here to reset password.',
      subject: '[Jitera] パスワード再設定のお願い',
      html
    });

    return {
      message: 'Prepare to reset password successfully!'
    };
  }

  async validResetPassword(token: string): Promise<boolean> {
    const user = await this.repo.findOne({ where: { reset_password_token: token, is_active: USER_STATUS.ACTIVATED } });
    if (!user) {
      throw new BadRequestException(this.i18n.translate('messages.RESET_PASSWORD_LINK_WRONG'));
    }
    // Check token expired 30 minutes with date reset_password_at
    const date = new Date();
    const diff = date.getTime() - user.reset_password_at.getTime();
    if (diff > CONSTANTS.RESET_PASSWORD_LINK_EXPIRY_TIME) {
      return false;
    }

    return true;
  }

  async updatePassword(token: string, body: IResetPassword) {
    const user: IUsers = await this.repo.findOne({ where: { reset_password_token: token, is_active: USER_STATUS.ACTIVATED } });
    if (!user) {
      throw new BadRequestException(this.i18n.translate('messages.USER_NOT_FOUND'));
    }

    // Check token expired 30 minutes with date reset_password_at
    const date = new Date();
    const diff = date.getTime() - user.reset_password_at.getTime();
    if (diff > CONSTANTS.RESET_PASSWORD_LINK_EXPIRY_TIME) {
      throw new BadRequestException(this.i18n.translate('messages.RESET_PASSWORD_LINK_EXPIRED'));
    }

    const comparePassword = await bcrypt.compare(body.password, user.password);
    if (comparePassword) {
      throw new BadRequestException(this.i18n.translate('messages.PASSWORD_CHANGE_ERROR'));
    }
    const password = await bcrypt.hash(body.password, 10);
    return this.updateUser(user.id, { password });
  }
}
