import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger"

interface LoginPayload {
  username: string,
  password: string
}
@Controller()
@ApiTags('App')
export class AppController {
  constructor() { }

  @Get('ping')
  @ApiOperation({ summary: 'Ping/Pong' })
  ping() {
    return 'pong';
  }
}
