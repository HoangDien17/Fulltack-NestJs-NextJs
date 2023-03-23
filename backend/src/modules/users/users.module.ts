import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import MailService from '../mails/mail.service';
import { User } from './users.entity';
import { UsersController } from './users.controller';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, MailService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
