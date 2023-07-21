import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TenantEntity, UserEntity, UserRoleEntity, PermissionEntity } from 'src/domain/entities';

import { UsersPrivilegesServiceModule } from 'src/core/users/user-privileges.module';
import { ManageUserRolesModule } from 'src/core/rbac/manage-user-roles.module';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    UsersPrivilegesServiceModule,
    ManageUserRolesModule,
    TypeOrmModule.forFeature([ UserEntity, TenantEntity, UserRoleEntity, PermissionEntity ]),
  ],
  providers: [ UsersResolver, UsersService ],
  exports: [ UsersService ]
})
export class UsersModule { }
