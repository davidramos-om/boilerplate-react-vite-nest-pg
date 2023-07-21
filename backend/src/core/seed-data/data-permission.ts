import { CreatePermissionDto } from "src/domain/dtos/rbac/permissions.dto";
import { PermissionAction, PermissionObjectType } from 'src/core/authorization/ac-options'

interface ResourceType {
    name: string;
    description: string;
    resource: PermissionObjectType;
    group: 'General' | 'Security' | 'Settings';
    module: 'Global' | 'Tenanted';
    actions: PermissionAction[];
    resourceOrder: number;
}


const defaultActions: PermissionAction[] = [ 'PAGE', 'READ', 'CREATE', 'UPDATE', 'DELETE' ];

const AccessOptions: ResourceType[] = [
    {
        name: 'Solicitudes',
        description: 'Acceso para revisar las solicitudes de ingreso al sistema',
        group: 'General',
        resource: 'ONBOARDING',
        actions: [ 'PAGE', 'READ', 'UPDATE' ],
        module: 'Global',
        resourceOrder: 1
    },
    {
        name: 'Empresas',
        description: 'Puede gestionar las diferentes configuraciones para una empresa',
        resource: 'TENANTS',
        group: 'General',
        actions: defaultActions.concat('ACTIVATE', 'DEACTIVATE'),
        module: 'Global',
        resourceOrder: 2
    },
    {
        name: 'Portal Dashboard',
        description: 'Visualizar el tablero de información',
        resource: 'PORTAL_DASHBOARD',
        group: 'General',
        actions: [ 'PAGE' ],
        module: 'Global',
        resourceOrder: 3
    },
    {
        name: 'Usuarios',
        description: 'Puede gestionar las diferentes configuraciones para un usuario',
        resource: 'USERS',
        group: 'Security',
        actions: defaultActions.concat('DEACTIVATE', 'ACTIVATE'),
        module: 'Global',
        resourceOrder: 99,
    },
    {
        name: 'Resetear Contraseña',
        description: 'Puede cambiar la contraseña de un usuario',
        resource: 'RESET_USER_PASSWORD',
        group: 'Security',
        actions: [ 'UPDATE' ],
        module: 'Global',
        resourceOrder: 101,
    },
    {
        name: 'Reactivar Usuario',
        description: 'Habilitar un usuario que se encuentra deshabilitado',
        resource: 'ACTIVATE_USER',
        group: 'Security',
        actions: [ 'UPDATE' ],
        module: 'Global',
        resourceOrder: 102
    },
    {
        name: 'Desactivar Usuario',
        description: 'Deshabilitar el acceso de un usuario',
        resource: 'DEACTIVATE_USER',
        group: 'Security',
        actions: [ 'UPDATE' ],
        module: 'Global',
        resourceOrder: 103
    },
    {
        name: 'Roles',
        description: 'Puede gestionar las diferentes configuraciones para un perfil de acceso',
        resource: 'ROLES',
        group: 'Security',
        actions: defaultActions,
        module: 'Global',
        resourceOrder: 104

    },
    {
        name: 'Configuración',
        description: 'Acceso para revisar las configuraciones del sistema',
        resource: 'CONFIGURATION',
        group: 'Settings',
        actions: [ 'PAGE', 'UPDATE' ],
        module: 'Global',
        resourceOrder: 105
    },
];

export function getPermissions(): CreatePermissionDto[] {

    const permissions: CreatePermissionDto[] = [];

    //sort resources by order
    const sortedAccessOptions = AccessOptions.sort((a, b) => a.resourceOrder - b.resourceOrder);

    sortedAccessOptions.forEach(option => {
        option.actions.forEach((action, index) => {
            permissions.push({
                name: option.name,
                code: `${option.resource.trim()}_${action.trim()}`,
                action: action,
                module: option.module,
                resource: option.resource,
                description: option.description,
                group: option.group,
                order: (index + 1),
                resource_order: option.resourceOrder
            })
        })
    });

    return permissions;
}