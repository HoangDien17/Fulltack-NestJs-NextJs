import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import MailService from '../mails/mail.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, MailService],
  exports: [AuthService]
})
export class AuthModule {}
