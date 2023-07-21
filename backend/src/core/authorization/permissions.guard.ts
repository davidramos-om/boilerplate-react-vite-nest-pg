import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";

import { UserContextDto } from "src/domain/dtos/auth";
import { PERMISSION_CHECKER_KEY, RequiredPermission } from "./check-permissions.decorator";
import { AppAbility, CaslAbilityFactory } from "./casl-ability.factory";
import { USER_TYPE } from "src/common/enums/user-type";

@Injectable()
export class PermissionsGuard implements CanActivate {

    constructor(private reflector: Reflector, private abilityFactory: CaslAbilityFactory) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredPermissions = this.reflector.get<RequiredPermission[]>(PERMISSION_CHECKER_KEY, context.getHandler()) || [];

        const gqlCtx = GqlExecutionContext.create(context);
        const request = gqlCtx.getContext().req;
        const user = request.user as UserContextDto;

        if (user.type === USER_TYPE.PORTAL_ROOT)
            return true;

        const ability = await this.abilityFactory.createForUser(user);
        return requiredPermissions.every(permission => this.isAllowed(ability, permission));
    }

    private isAllowed(ability: AppAbility, permission: RequiredPermission): boolean {
        return ability.can(...permission);
    }

}