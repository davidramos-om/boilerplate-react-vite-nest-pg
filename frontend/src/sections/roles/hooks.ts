
import { useQuery } from '@apollo/client';
import { PermissionModel } from "src/types/roles";

import { GET_ALL_PERMISSIONS } from './gql';

export type VirtuosoDataItem = {
    name: string,
    description: string,
    resource: string,
    permissions: PermissionModel[]
}

export const usePermissions = () => {

    const { data, loading, error } = useQuery<{ permissions: PermissionModel[] }>(GET_ALL_PERMISSIONS);

    const permissions = data?.permissions || [];

    //* Group the permissions by resource
    const groups = permissions.reduce((acc, permission) => {

        const group = acc[ permission.resource ] || { resource: permission.resource, name: permission.name, description: permission.description, permissions: [] };
        group.permissions.push(permission);

        return { ...acc, [ permission.resource ]: group };

    }, {} as { [ key: string ]: { resource: string; name: string, description: string, permissions: PermissionModel[] } });

    //* Conver the groups object to an array of (name, description, permissions, and the like)
    const virtuosoData = Object.keys(groups).map((key): VirtuosoDataItem => {
        const group = groups[ key ];
        return {
            name: group.name,
            description: group.description,
            resource: group.resource,
            permissions: group.permissions,
        };
    });

    return { permissions, groups, virtuosoData, loading, error };
}