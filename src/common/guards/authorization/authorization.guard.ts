import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName, Roles } from 'src/common/decorator';
import { RoleEnum } from 'src/common/enums';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accessRoles: RoleEnum[] = this.reflector.getAllAndOverride<RoleEnum[]>(RoleName, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [];

    console.log({ context, accessRoles });

    let role: RoleEnum = RoleEnum.user;

    switch (context.getType()) {
      case 'http':
        role = context.switchToHttp().getRequest().credentials?.user?.role
        break;
      default:
        break;
    }

    return accessRoles.includes(role);
  }
}
