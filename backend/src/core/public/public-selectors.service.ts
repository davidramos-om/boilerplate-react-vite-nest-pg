import { Injectable } from "@nestjs/common";

import { SessionDto } from "src/core/authorization";
import { ManageRoleService } from 'src/core/rbac/manage-roles.service';

@Injectable()
export class PublicDataSelectorsService {

    constructor(
        private readonly roleService: ManageRoleService
    ) { }

    async getRoles(ssn: SessionDto) {
        return this.roleService.getRoles(ssn);
    }
}