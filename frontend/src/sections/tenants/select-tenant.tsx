import { useMemo } from "react";
import { useQuery } from '@apollo/client'
import Skeleton from "@mui/material/Skeleton";
import { RHFAutocomplete, } from 'src/components/hook-form';
import Image from "src/components/image/image";

import { SELECT_TENANT } from './gql';

type Tenant = {
    id: string;
    name: string;
    code: string;
    logo_url: string;
}

function mapTenant(tnt: any): Tenant {
    return {
        id: tnt.id,
        name: tnt.name,
        code: tnt.code,
        logo_url: tnt.logo_url
    }
}

type Props = {
    field?: string
    value: string;
    label?: string;
    disabled?: boolean;
    filter?: (tenant: any) => boolean;
    onChange: (value: any) => void;
}
export default function SelectTenant({ value, disabled, field = "tenant_id", label = "Empresa", filter = () => true, onChange }: Props) {

    const { data, loading, error } = useQuery(SELECT_TENANT);
    const tenants: Tenant[] = useMemo(() => data?.tenants?.filter(filter)?.map(mapTenant) || [], [ data, filter ]);

    if (loading)
        return <Skeleton variant="rectangular" width="100%" height={56} animation="wave" sx={{ borderRadius: 1 }} />

    const selectedOption = tenants.find((option) => option.id === value);

    return (
        <RHFAutocomplete
            fullWidth
            multiple={false}
            disabled={disabled}
            loading={loading}
            name={field}
            label={label}
            value={selectedOption || null}
            options={tenants}
            getOptionLabel={(option) => {
                if (typeof option === 'string')
                    return option;

                return `${option.name} (${option.code})`;
            }}
            isOptionEqualToValue={(option, iValue) => option === iValue}
            helperText={error?.message || ''}
            onChange={(e, eValue) => {
                if (typeof eValue === 'string')
                    return onChange(eValue);

                return onChange(eValue?.id);
            }}
            renderOption={(props, option) => {

                const { code, name, logo_url } = tenants.filter((tnt) => tnt.id === option.id)[ 0 ];
                if (!name) {
                    return null;
                }

                return (
                    <li {...props} key={name}>
                        <Image src={logo_url} alt={name} width={24} height={24} pr={1} />
                        {name} ({code})
                    </li>
                );
            }}
        />
    );
}



