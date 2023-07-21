import { AuthenticatedUser } from "./authentication";
import { ITenant } from "./tenants";
import { USER_TYPE } from "./users";

export type CreateRoleInput = {
    name: string;
    description: string;
    tenant_id: string;
    permissions: string[];
}

export type PermissionModel = {
    id: string;
    name: string;
    code: string;
    description: string;
    action: string;
    module: string;
    resource: string;
    group: string;
    order: number;
}


export type IRole = {
    id: string;
    name: string;
    description: string;
    tenant: ITenant
    permissions: PermissionModel[];
}

export const getTenantValue = (user: AuthenticatedUser | null, row: IRole | undefined) => {

    if (user?.userType === USER_TYPE.PORTAL_ROOT) {
        return row?.tenant?.id || '';
    }

    return user?.tenantId || '';
}
