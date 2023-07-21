import { Injectable } from "@nestjs/common";
import { Ability } from "@casl/ability";

import { UserContextDto } from "src/domain/dtos/auth";
import { PermissionAction, PermissionObjectType } from "./ac-options"
import { AuthorizationService } from "./authorization.service";


export type AppAbility = Ability<[ PermissionAction, PermissionObjectType ]>;

interface CaslPermission {
    action: PermissionAction;

    // In our database, Users, Tenants, ... are called "object"  but in CASL they are called "subject"
    subject: PermissionObjectType;
}

@Injectable()
export class CaslAbilityFactory {

    constructor(private authoService: AuthorizationService) { }

    async createForUser(user: UserContextDto): Promise<AppAbility> {

        if (!user)
            return new Ability<[ PermissionAction, PermissionObjectType ]>([]);

        const dbPermissions = await this.authoService.getUserPermissions({ userRowId: user.userRowId, tenantId: user.tenantId, userType: user.type });

        const caslPermissions: CaslPermission[] = dbPermissions.map(p => ({
            action: p.action as PermissionAction,
            subject: p.resource as PermissionObjectType
        }));

        return new Ability<[ PermissionAction, PermissionObjectType ]>(caslPermissions);
    }
}