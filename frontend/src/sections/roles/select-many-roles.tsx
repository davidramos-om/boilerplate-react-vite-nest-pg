import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Skeleton from "@mui/material/Skeleton";

import { RHFMultiSelect } from "src/components/hook-form/rhf-select";
import { SELECT_ROLE } from './gql';

type Role = {
    id: string;
    name: string;
    type: string,
    tenant_id: string,
    tenant_name: string,
}

function mapRole(role: any): Role {
    return {
        id: role.id,
        name: `${role.name} (${role.role_type}) ${role.tenant?.name ? ` - ${role.tenant?.name}` : ''}`,
        type: role.role_type,
        tenant_id: role.tenant?.id || '',
        tenant_name: role.tenant?.name || '',
    }
}

type Props = {
    field?: string
    values: string[];
    label?: string;
    disabled?: boolean;
    filterFn?: (role: any) => boolean;
    onChange: (values: string[]) => void;
}

export default function SelectManyRoles({ values, disabled, field = "roles", label = "Perfiles de Acceso", filterFn = () => true, onChange }: Props) {

    const { data, loading, error } = useQuery(SELECT_ROLE);
    const roles: Role[] = useMemo(() => data?.roles?.filter(filterFn)?.map(mapRole) || [], [ data, filterFn ]);

    if (loading)
        return <Skeleton variant="rectangular" width="100%" height={56} animation="wave" sx={{ borderRadius: 1 }} />

    const options = roles.map((role) => ({ label: role.name, value: role.id }));
    const selectedOptions = options.filter((option) => values.includes(option.value)).map((option) => option.value);

    return (
        <RHFMultiSelect
            checkbox
            name={field}
            label={label}
            disabled={disabled}
            value={selectedOptions || null}
            options={options}
            helperText={error?.message || ''}
            onChange={(e: any) => {
                const _values = e.target.value.map((option: any) => {
                    if (typeof option === 'string')
                        return option;

                    return option.value;
                });

                onChange(_values);
            }}
        />
    );
}