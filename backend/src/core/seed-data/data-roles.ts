import { ROLE_TYPE } from "src/common/enums/roles";
import { CreateRoleInput } from 'src/domain/dtos/rbac/roles.dto';

export const roles: CreateRoleInput[] = [
    {
        name: 'Portal Root',
        code: 'ROOT',
        description: 'Role con privilegios de administrador del portal, tiene acceso a todas las funcionalidades del sistema.',
        tenant_id: null,
        permissions: [],
        type: ROLE_TYPE.FULL_ACCESS
    }
]