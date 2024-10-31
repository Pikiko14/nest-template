import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new NotFoundException('User not found');

    for (const role of user.roles) {
      if (roles.includes(role)) {
        return true;
      }
    }

    throw new UnauthorizedException('User not authorized');
  }
}
