import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";

import { UserSession, SessionDto, JwtAuthGuard, PermissionsGuard, CheckPermissions } from "src/core/authorization";
import { TenantModel } from "src/domain/models/tenant.model"
import { CreateTenantInput, UpdateTenantInput } from "src/domain/dtos/tenant/create.dto";

import { TenantsService } from "./tenants.service";

@Resolver(() => TenantModel)
@UseGuards(JwtAuthGuard)
export class TenantResolver {

    constructor(
        private readonly tenantService: TenantsService
    ) { }

    @Query(() => [ TenantModel ])
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'READ', 'TENANTS' ])
    tenants(): Promise<TenantModel[]> {
        return this.tenantService.findAll();
    }

    @Query(() => TenantModel, { nullable: true })
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'READ', 'TENANTS' ])
    tenant(@Args("id", { type: () => String }) id: string): Promise<TenantModel> {
        return this.tenantService.findByRowId(id);
    }

    @Mutation(() => TenantModel)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'CREATE', 'TENANTS' ])
    createTenant(@Args("input") input: CreateTenantInput, @UserSession() ssn: SessionDto): Promise<TenantModel> {
        return this.tenantService.create(input, ssn);
    }

    @Mutation(() => TenantModel)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'UPDATE', 'TENANTS' ])
    updateTenant(@Args("input") input: UpdateTenantInput, @UserSession() ssn: SessionDto): Promise<TenantModel> {
        return this.tenantService.update(input, ssn);
    }
}
