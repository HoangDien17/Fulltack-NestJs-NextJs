import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { MailInterface } from './mail.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class MailService {
  constructor(private readonly configService: ConfigService) {}

  async sendMail(options: MailInterface) {
    const transporter = nodemailer.createTransport({
      host: this.configService.get('email.smtpHost'),
      port: this.configService.get('email.smtpPort'),
      auth: {
        user: this.configService.get('email.smtpUsername'),
        pass: this.configService.get('email.smtpPassword')
      },
      tls: {
        ciphers: this.configService.get('email.ciphers')
      }
    });

    try {
      return transporter.sendMail({
        from: `${process.env.SMTP_SENDER || options.from}`,
        to: options.to,
        cc: options?.cc,
        bcc: options?.bcc,
        subject: options.subject,
        text: options.text,
        html: options.html
      });
    } catch (error) {
      console.error(error);
    }
  }
}
