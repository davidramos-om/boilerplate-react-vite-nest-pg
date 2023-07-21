import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RoleEntity, UserEntity, PermissionEntity } from "src/domain/entities";

import { SeedDataResolver } from "./seed.resolver";
import { SeedRolesService } from "./seed-roles.service";
import { SeedUsersService } from "./seed-users.service";
import { SeedPermissionService } from "./seed-permissions.service";

@Module({
    imports: [ TypeOrmModule.forFeature([ RoleEntity, UserEntity, PermissionEntity ]) ],
    providers: [
        SeedDataResolver,
        SeedRolesService,
        SeedUsersService,
        SeedPermissionService
    ],
    exports: []
})
export class SeedDataModule { }
