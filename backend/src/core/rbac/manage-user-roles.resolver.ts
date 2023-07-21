import { UseGuards } from "@nestjs/common";
import { Resolver, Args, Mutation } from "@nestjs/graphql";

import { JwtAuthGuard, PermissionsGuard, CheckPermissions } from "src/core/authorization";
import { AssignRolesToUserInput } from "src/domain/dtos/rbac/roles.dto";
import { ManageUserRoleService } from "./manage-user-roles.service";

@Resolver()
@UseGuards(JwtAuthGuard)
export class ManageUserRolesResolver {

    constructor(
        private readonly manageUserRolesService: ManageUserRoleService
    ) { }

    @Mutation(() => Boolean)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'UPDATE', 'ROLES' ])
    async assignRolesToUser(@Args("input") input: AssignRolesToUserInput): Promise<boolean> {
        await this.manageUserRolesService.assignRolesToUser(input);
        return true;
    }
}
