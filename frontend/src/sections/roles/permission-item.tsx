import { useFormContext } from 'react-hook-form';
import { Checkbox, Divider, FormControlLabel, FormGroup, Stack, Typography } from "@mui/material";
import { PermissionModel } from "src/types/roles";

import { usePermissions } from "./hooks";

type action_translations = {
    [ key: string ]: string;
}

export type VirtuosoDataItem = {
    name: string,
    description: string,
    resource: string,
    permissions: PermissionModel[]
}

export const translations: action_translations = {
    FULL_ACCESS: 'Acceso Completo',
    PAGE: 'Menú',
    READ: 'Lectura',
    CREATE: 'Crear',
    UPDATE: 'Modificar',
    DELETE: 'Eliminar',
    OPEN: 'Abrir',
    ACTIVATE: 'Reactivar',
    DEACTIVATE: 'Desactivar',
    RESET_PASSWORD: 'Reiniciar Contraseña',
}


type PermissionItemProps = {
    item: VirtuosoDataItem
}

type PermissionItemActionProps = {
    permission: PermissionModel
}

function PermissionItemAction({ permission }: PermissionItemActionProps) {

    const { id, action, resource } = permission;
    const { getValues, setValue } = useFormContext();
    const { permissions: allPermissions } = usePermissions();
    const { permissions: selectedPermissions } = getValues();

    const index = selectedPermissions.findIndex((_permission: string) => _permission === id);
    const isChecked = index !== -1;
    const isFullAccess = action === 'FULL_ACCESS';


    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {

        const fullAccessId = allPermissions.find((item: PermissionModel) => item.action === 'FULL_ACCESS' && item.resource === resource)?.id;

        // when the action is FULL_ACCESS, we need to add/remove all the permissions of the resource, if the action is different and was checked, we need to uncheck the FULL_ACCESS for this resource        
        if (isFullAccess) {

            const resourcePermissions = allPermissions.filter((item) => item.resource === resource).map((item: PermissionModel) => item.id);

            if (isChecked) {
                setValue('permissions', selectedPermissions.filter((item: string) => !resourcePermissions.includes(item)));
            }
            else {
                // get the ones that are not in the list
                const filteredPermissions = resourcePermissions.filter((item: string) => !selectedPermissions.includes(item));
                setValue('permissions', [ ...selectedPermissions, ...filteredPermissions ]);
            }
        }
        else {

            const isInList = selectedPermissions.some((_permission: string) => _permission === id);
            if (isInList) {

                const filteredPermissions = selectedPermissions.filter((item: string) => item !== id);

                // if the FULL_ACCESS is checked, we need to uncheck it
                if (fullAccessId && filteredPermissions.some((_permission: string) => _permission === fullAccessId)) {
                    setValue('permissions', filteredPermissions.filter((item: string) => item !== fullAccessId));
                }
                else {
                    setValue('permissions', filteredPermissions);
                }
            } else {

                // if almost all permissions are checked, we need to check the FULL_ACCESS
                const allPermissionsForThisResource = allPermissions.filter((item: PermissionModel) => item.resource === resource && item.action !== 'FULL_ACCESS').map((item: PermissionModel) => item.id);

                if (allPermissionsForThisResource.every((_permission: string) => selectedPermissions.includes(_permission))) {

                    // if full access is not checked, we need to check it
                    if (fullAccessId && !selectedPermissions.some((_permission: string) => _permission === fullAccessId)) {
                        setValue('permissions', [ ...selectedPermissions, fullAccessId ]);
                    }
                    else {
                        setValue('permissions', [ ...selectedPermissions, id ]);
                    }
                }
                else {
                    setValue('permissions', [ ...selectedPermissions, id ]);
                }
            }
        }
    }

    return (
        <FormControlLabel
            id={permission.id}
            control={<Checkbox checked={isChecked} onChange={handleCheck} />}
            label={`${translations[ permission.action ] || permission.action}`}
        />
    );
}

export default function PermissionItem({ item }: PermissionItemProps) {
    return (
        <FormGroup>
            <Typography variant="h6" component="h3">{item.name}</Typography>
            <Typography variant="body2" component="p">{item.description}</Typography>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 0, sm: 2 }}
                divider={<Divider orientation="vertical" flexItem />}
            >
                {item.permissions.map(permission => (
                    <PermissionItemAction key={permission.id} permission={permission} />
                ))}

            </Stack>
            <Divider style={{ margin: '1rem 0' }} />
        </FormGroup>
    );
}
