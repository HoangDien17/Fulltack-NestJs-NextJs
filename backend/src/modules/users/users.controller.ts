import { Body, Controller, Param, Query, Get, Res, Post, Patch } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PreResetPasswordDto, ResetPasswordDto } from './users.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private configService: ConfigService) {}

  @Post('/pre-reset-password')
  @ApiOperation({ summary: 'Pre Reset Password', operationId: 'PreResetPassword', description: 'Pre Reset Password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'String', example: 'abc@gmail.com' }
      }
    }
  })
  async preResetPassword(@Body() body: PreResetPasswordDto) {
    return await this.usersService.preResetPassword(body.email);
  }

  @Get('/confirm-reset-password')
  @ApiOperation({ summary: 'Confirm reset password', operationId: 'ConfirmResetPassword', description: 'Confirm reset password' })
  @ApiQuery({ type: 'string', name: 'token', required: false, example: 'xxxxxxxxx' })
  async confirmRegister(@Query() query, @Res() res: Response) {
    await this.usersService.validResetPassword(query.token);
    res.redirect(`${this.configService.get('frontendUrl')}/update-password/${query.token}`);
  }

  @Patch('/update-password/:token')
  @ApiOperation({ summary: 'Reset Password', operationId: 'ResetPassword', description: 'Reset Password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: { type: 'String', example: 'a123456' },
        rePassword: { type: 'String', example: 'a123456' }
      }
    }
  })
  async updatePassword(@Body() body: ResetPasswordDto, @Param('token') token: string) {
    return await this.usersService.updatePassword(token, body);
  }
}
