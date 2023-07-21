import { Injectable } from "@nestjs/common";

import { SessionDto } from "src/domain/dtos/auth";
import { PermissionModel } from 'src/domain/models/role.model'
import { UserPrivilegesService } from "src/core/users/user-privileges.service";
import { USER_TYPE } from "src/common/enums/user-type";

@Injectable()
export class AuthorizationService {

    constructor(
        private readonly userPrivilegesService: UserPrivilegesService
    ) { }

    async findAllPermissionsOfUser(ssn: SessionDto): Promise<PermissionModel[]> {
        return this.userPrivilegesService.findAllPermissionsBySession(ssn);
    }

    async getUserPermissions(params: { userRowId: string; userType: USER_TYPE; tenantId: string }): Promise<PermissionModel[]> {
        return this.userPrivilegesService.getUserPermissions(params);
    }
}