import { UseGuards } from "@nestjs/common";
import { Resolver, Query } from "@nestjs/graphql";

import { JwtAuthGuard } from "src/core/auth/auth.guard";
import { PermissionModel } from "src/domain/models/role.model";

import { ManagePermissionsService } from "./manage-permissions.service"

@Resolver(() => PermissionModel)
@UseGuards(JwtAuthGuard)
export class ManagePermissionsResolver {

    constructor(
        private readonly managePermissionsService: ManagePermissionsService
    ) { }

    @Query(() => [ PermissionModel ])
    permissions(): Promise<PermissionModel[]> {
        return this.managePermissionsService.getPermissions();
    }
}
