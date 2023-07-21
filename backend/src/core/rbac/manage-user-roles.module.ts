import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RoleEntity, UserEntity, UserRoleEntity } from "src/domain/entities";

import { ManageUserRolesResolver } from "./manage-user-roles.resolver";
import { ManageUserRoleService } from "./manage-user-roles.service";

@Module({
    imports: [ TypeOrmModule.forFeature([ RoleEntity, UserEntity, UserRoleEntity ]) ],
    providers: [
        ManageUserRolesResolver,
        ManageUserRoleService
    ],
    exports: [ ManageUserRoleService ]
})

export class ManageUserRolesModule { }
