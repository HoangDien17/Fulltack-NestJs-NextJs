import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAuthResponse, IAuthRequest } from './auth.interface';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { ICreateUser, IUsers } from '../users/users.interface';
import MailService from '../mails/mail.service';
import { SHA256 } from 'crypto-js';
import { render } from 'ejs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { USER_STATUS } from '../../utils/enum';
import { CONSTANTS } from '../../utils/constants';
import * as dayjs from 'dayjs';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly i18n: I18nService
  ) {}

  async signUp(body: ICreateUser): Promise<IAuthResponse> {
    const findUser = await this.usersService.findByCondition({ email: body.email });
    if (findUser) {
      throw new BadRequestException(this.i18n.translate('messages.EMAIL_ALREADY_REGISTERED'));
    }
    const emailToken = SHA256(`${body.email}${new Date().getTime()}`).toString();

    const user: IUsers = await this.usersService.createUser({
      ...body,
      register_token: emailToken
    });

    const { accessToken, refreshToken } = this.generateToken(user);

    // Send email
    const url = `${this.configService.get('backendUrl')}/auth/confirm-register?token=${emailToken}`;
    const template = await readFileSync(resolve(__dirname + './../../../templates/confirm.ejs'), 'utf-8');
    const html = render(template, { url, first_name: user.first_name, last_name: user.last_name });
    this.mailService.sendMail({
      to: user.email,
      text: 'Click here to confirm register.',
      subject: '[Jitera] メールアドレスの認証',
      html
    });

    return {
      refreshToken,
      accessToken,
      user
    };
  }

  async confirmRegister(token: string): Promise<void> {
    const user: IUsers = await this.usersService.findByCondition({ register_token: token });
    if (!user) {
      throw new NotFoundException(this.i18n.translate('messages.EMAIL_CONFIRMATION_LINK_WRONG'));
    }
    const now = new Date().getTime() / 1000;
    const registerTime = new Date(user.confirm_email_at).getTime() / 1000;
    if (now - registerTime > CONSTANTS.CONFIRMATION_LINK_EXPIRY_TIME || user.is_active) {
      throw new BadRequestException(this.i18n.translate('messages.EMAIL_CONFIRMATION_LINK_WRONG'));
    }
    await this.usersService.updateUser(user.id, { is_active: USER_STATUS.ACTIVATED });
  }

  private generateToken(user: IUsers) {
    return {
      accessToken: jwt.sign({ email: user.email, id: user.id }, this.configService.get('jwt.secretKey'), {
        expiresIn: this.configService.get('jwt.accessTokenExpiryTime')
      }),
      refreshToken: jwt.sign({ id: user.id }, this.configService.get('jwt.refreshSecretKey'), {
        expiresIn: this.configService.get('jwt.refreshTokenExpiryTime')
      })
    };
  }

  async signIn(body: IAuthRequest): Promise<IAuthResponse> {
    const user: IUsers = await this.usersService.findByCondition({ email: body.email, is_active: 1 });
    if (!user) {
      throw new NotFoundException(this.i18n.translate('messages.USER_NOT_FOUND'));
    }

    if (user.lock_time && new Date().getTime() - user.lock_time?.getTime() < 0) {
      throw new BadRequestException(this.i18n.translate('messages.ACCOUNT_LOCKED'));
    }

    const comparePassword = await bcrypt.compare(body.password, user.password);
    if (!comparePassword) {
      const dataUpdate = { attack_count: user.attack_count + 1 };
      if (user.attack_count + 1 === 5) {
        dataUpdate['lock_time'] = dayjs(new Date()).add(6, 'hours').toDate();
      }
      await this.usersService.updateUser(user.id, dataUpdate);
      throw new BadRequestException(this.i18n.translate('messages.WRONG_EMAIL_PASSWORD'));
    }

    await this.usersService.updateUser(user.id, { attack_count: 0, lock_time: null });
    const { accessToken, refreshToken } = this.generateToken(user);

    return {
      refreshToken,
      user,
      accessToken
    };
  }
}
