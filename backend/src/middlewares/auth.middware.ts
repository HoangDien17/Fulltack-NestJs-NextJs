import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../modules/users/users.service';
import { USER_STATUS } from '../utils/enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      this.throwUnauthorizedError();
    }
    const token = req.headers.authorization.replace('Bearer ', '');
    try {
      const decode: Record<string, any> = jwt.decode(token);
      const user = await this.usersService.findByCondition({ id: decode.id, is_active: USER_STATUS.ACTIVATED });
      if (!user) {
        this.throwUnauthorizedError();
      }
      req.user = user;
      return true;
    } catch (error) {
      this.throwUnauthorizedError();
    }
  }
  throwUnauthorizedError() {
    throw new UnauthorizedException({ errorMessage: 'Unauthorized' });
  }

  throwUserNotFoundError() {
    throw new ForbiddenException({ errorMessage: 'Unable to authenticate!' });
  }
}
