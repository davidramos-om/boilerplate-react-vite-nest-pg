import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersModule } from "src/core/users/users.module";
import { TenantEntity } from "src/domain/entities";
import { TenantResolver } from "./tenants.resolver";
import { TenantsService } from "./tenants.service";
import { TenantSchemaService } from "./tenant-squema.service";
import { TenantMigrationsResolver } from "./tenant-migrations.resolver";

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([ TenantEntity ])
    ],
    providers: [ TenantResolver, TenantMigrationsResolver, TenantsService, TenantSchemaService ],
    exports: [ TenantsService, TenantSchemaService ]
})

export class TenantsModule { }
