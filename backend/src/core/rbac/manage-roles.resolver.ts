import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";

import { UserSession, SessionDto, JwtAuthGuard, PermissionsGuard, CheckPermissions } from "src/core/authorization";
import { RoleModel } from "src/domain/models/role.model";
import { CreateRoleInput, UpdateRoleInput } from "src/domain/dtos/rbac/roles.dto";


import { ManageRoleService } from "./manage-roles.service"

@Resolver(() => RoleModel)
@UseGuards(JwtAuthGuard)
export class ManageRolesResolver {

    constructor(
        private readonly manageRolesService: ManageRoleService
    ) { }

    @Query(() => [ RoleModel ])
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'READ', 'ROLES' ])
    roles(@UserSession() ssn: SessionDto): Promise<RoleModel[]> {
        return this.manageRolesService.getRoles(ssn);
    }

    @Query(() => RoleModel, { nullable: true })
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'READ', 'ROLES' ])
    role(@Args("id", { type: () => String }) id: string, @UserSession() ssn: SessionDto): Promise<RoleModel> {
        return this.manageRolesService.getRoleById(id, ssn);
    }

    @Mutation(() => RoleModel)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'CREATE', 'ROLES' ])
    createRole(@Args("input") input: CreateRoleInput, @UserSession() ssn: SessionDto): Promise<RoleModel> {
        return this.manageRolesService.createRole(input, ssn);
    }

    @Mutation(() => RoleModel)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'UPDATE', 'ROLES' ])
    updateRole(@Args("input") input: UpdateRoleInput, @UserSession() ssn: SessionDto): Promise<RoleModel> {
        return this.manageRolesService.updateRole(input, ssn);
    }

    @Mutation(() => Boolean)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'DELETE', 'ROLES' ])
    async deleteRole(@Args("id", { type: () => String }) id: string, @UserSession() ssn: SessionDto): Promise<boolean> {
        await this.manageRolesService.deleteRole(id, ssn);
        return true;
    }
}
