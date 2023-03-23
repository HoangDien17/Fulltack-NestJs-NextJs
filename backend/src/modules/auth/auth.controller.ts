import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { IConfirmRegister, ICreateUser } from '../users/users.interface';
import { CreateUsersDto } from '../users/users.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService) {}

  @Post('/sign-up')
  @ApiOperation({ summary: 'Sign up', operationId: 'SignUp', description: 'Sign Up' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'String', example: 'abc' },
        lastName: { type: 'String', example: 'edf' },
        email: { type: 'String', example: 'abc@gmail.com' },
        password: { type: 'String', example: 'a123456' }
      }
    }
  })
  async signUp(@Body() body: CreateUsersDto) {
    return await this.authService.signUp(body);
  }

  @Get('/confirm-register')
  @ApiOperation({ summary: 'Confirm register', operationId: 'ConfirmRegister', description: 'Confirm register' })
  @ApiQuery({ type: 'string', name: 'token', required: false, example: 'xxxxxxxxx' })
  async confirmRegister(@Query() query: IConfirmRegister, @Res() res: Response) {
    await this.authService.confirmRegister(query.token);
    res.redirect(`${this.configService.get('frontendUrl')}/sign-in`);
  }

  @Post('/sign-in')
  @ApiOperation({ summary: 'Sign In', operationId: 'SignIn', description: 'Sign In' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'String', example: 'abc@gmail.com' },
        password: { type: 'String', example: 'a123456' }
      }
    }
  })
  async signIn(@Body() body: AuthDto) {
    return await this.authService.signIn(body);
  }
}
