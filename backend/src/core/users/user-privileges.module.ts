import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRoleEntity, PermissionEntity } from 'src/domain/entities';
import { UserPrivilegesService } from './user-privileges.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ UserRoleEntity, PermissionEntity ]),
    ],
    providers: [ UserPrivilegesService ],
    exports: [ UserPrivilegesService ]
})
export class UsersPrivilegesServiceModule { }
