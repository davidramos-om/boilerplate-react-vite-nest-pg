import { Global, Module } from "@nestjs/common";
// import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersPrivilegesServiceModule } from 'src/core/users/user-privileges.module'
// import { PermissionEntity } from "src/domain/entities/";
import { CaslAbilityFactory } from "./casl-ability.factory";
import { PermissionsGuard } from "./permissions.guard";
import { AuthorizationService } from "./authorization.service";


@Global()
@Module({
    imports: [
        UsersPrivilegesServiceModule
    ],
    providers: [ CaslAbilityFactory, PermissionsGuard, AuthorizationService ],
    exports: [ CaslAbilityFactory, PermissionsGuard ],
})
export class AuthorizationModule { }