import { UseGuards } from "@nestjs/common";
import { Resolver, Args, Mutation } from "@nestjs/graphql";

import { JwtAuthGuard } from "src/core/auth/auth.guard";
import { UserSession } from "src/core/authorization/session.decorator";
import { TenantModel } from "src/domain/models/tenant.model"
import { SessionDto } from "src/domain/dtos/auth";
import { PgCredentialResult, RunMigrationResult, SchemaResult } from "src/domain/dtos/tenant/create.dto";

import { TenantsService } from "./tenants.service";
import { TenantSchemaService } from "./tenant-squema.service";
import { USER_TYPE } from "src/common/enums/user-type";

@Resolver(() => TenantModel)
@UseGuards(JwtAuthGuard)
export class TenantMigrationsResolver {

    constructor(
        private readonly tenantService: TenantsService,
        private readonly tenantSchemaService: TenantSchemaService
    ) { }

    // ! BEGIN : D A N G E R    Z O N E

    @Mutation(() => SchemaResult)
    createTenantSchema(
        @Args("tenantId", { type: () => String }) tenantId: string,
        @UserSession() ssn: SessionDto
    ): Promise<SchemaResult> {

        if (ssn.userType !== USER_TYPE.PORTAL_ROOT)
            throw new Error("Only portal root can access this resource");

        return this.tenantService.createTenantSchema(tenantId);
    }

    @Mutation(() => [ RunMigrationResult ])
    runMigrations(@UserSession() ssn: SessionDto): Promise<RunMigrationResult[]> {

        if (ssn.userType !== USER_TYPE.PORTAL_ROOT)
            throw new Error("Only portal root can access this resource");

        return this.tenantSchemaService.runMigrations();
    }

    @Mutation(() => RunMigrationResult)
    runMigration(
        @Args("tenantId", { type: () => String }) tenantId: string,
        @UserSession() ssn: SessionDto
    ): Promise<RunMigrationResult> {

        if (ssn.userType !== USER_TYPE.PORTAL_ROOT)
            throw new Error("Only portal root can access this resource");

        return this.tenantSchemaService.runMigrationsByTenantId(tenantId);
    }

    @Mutation(() => PgCredentialResult)
    generatePgCredentials(
        @Args("tenantId", { type: () => String }) tenantId: string,
        @UserSession() ssn: SessionDto
    ): PgCredentialResult {

        if (ssn.userType !== USER_TYPE.PORTAL_ROOT)
            throw new Error("Only portal root can access this resource");

        return this.tenantSchemaService.PgCredentialResult(tenantId);
    }

    // ! END : D A N G E R    Z O N E
}
