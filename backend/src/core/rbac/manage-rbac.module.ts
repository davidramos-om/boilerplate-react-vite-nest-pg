import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TenantEntity, RoleEntity, RolePermissionEntity, PermissionEntity, UserEntity, UserRoleEntity } from "src/domain/entities";
import { ManageRolesResolver } from "./manage-roles.resolver";
import { ManageRoleService } from "./manage-roles.service";

import { ManageUserRolesModule } from "./manage-user-roles.module";
import { ManagePermissionsResolver } from "./manage-permissions.resolver";
import { ManagePermissionsService } from "./manage-permissions.service";


@Module({
    imports: [
        ManageUserRolesModule,
        TypeOrmModule.forFeature([ TenantEntity, RoleEntity, RolePermissionEntity, PermissionEntity, UserEntity, UserRoleEntity ])
    ],
    providers: [
        ManageRolesResolver,
        ManageRoleService,
        ManagePermissionsResolver,
        ManagePermissionsService
    ],
    exports: [ ManageRoleService, ManagePermissionsService ]
})
export class ManageRBACModule { }
