import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "src/domain/entities";
import { UsersPrivilegesServiceModule } from 'src/core/users/user-privileges.module'
import { UsersModule } from "src/core/users/users.module";
import { TenantsModule } from "src/core/tenants/tenants.module";
import config from "src/config";

import { AuthService } from "./auth.service";
import { AuthPasswordResetService } from "./auth-password.service";
import { AuthResolver } from "./auth.resolver";
import { JwtStrategy } from "./jwt.strategy";


const cf = config();

@Module({
  imports: [
    UsersModule,
    UsersPrivilegesServiceModule,
    TenantsModule,
    TypeOrmModule.forFeature([ UserEntity ]),
    JwtModule.register({
      global: true,
      secret: cf.JWT_SECRETKEY,
      signOptions: { expiresIn: cf.JWT_EXPIRES_IN },
    }),
  ],
  providers: [ AuthResolver, AuthService, AuthPasswordResetService, JwtStrategy ],
  exports: [ AuthService ]
})
export class AuthModule { }
