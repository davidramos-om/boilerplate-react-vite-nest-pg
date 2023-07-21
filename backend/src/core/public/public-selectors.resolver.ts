import { UseGuards } from "@nestjs/common";
import { Resolver, Query } from "@nestjs/graphql";

import { UserSession, SessionDto, JwtAuthGuard } from "src/core/authorization";
import { RoleModel } from "src/domain/models/role.model";

import { PublicDataSelectorsService } from "./public-selectors.service"

@Resolver(() => RoleModel)
@UseGuards(JwtAuthGuard)
export class PublicDataSelectorsResolver {

    constructor(
        private readonly publicSelectorService: PublicDataSelectorsService
    ) { }

    @Query(() => [ RoleModel ])
    rolesSelector(@UserSession() ssn: SessionDto): Promise<RoleModel[]> {
        return this.publicSelectorService.getRoles(ssn);
    }
}
