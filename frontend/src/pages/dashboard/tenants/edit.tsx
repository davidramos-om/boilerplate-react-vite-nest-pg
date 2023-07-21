import { useQuery } from '@apollo/client';
import { Skeleton, Grid, Paper } from '@mui/material';

import PageWrapper from 'src/components/PageWrapper';
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook/use-params';
import TenantForm from 'src/sections/tenants/tenant-form'
import { GET_ONE } from 'src/sections/tenants/gql';

const LoadingForm = () => (
    <Grid container spacing={2}>
        <Grid item xs={6}>
            <Paper elevation={0} variant="outlined" style={{ padding: '1rem' }}>
                <Skeleton variant="text" width="30%" height={60} style={{ marginBottom: '1rem' }} />
                <Skeleton variant="text" width="60%" height={60} style={{ marginBottom: '1rem' }} />
            </Paper>
        </Grid>
        <Grid item xs={6}>
            <Paper elevation={0} variant="outlined" style={{ padding: '1rem' }}>
                <Skeleton variant="text" width="100%" height={60} style={{ marginBottom: '1rem' }} />
                <Skeleton variant="text" width="100%" height={60} style={{ marginBottom: '1rem' }} />
                <Skeleton variant="text" width="100%" height={60} style={{ marginBottom: '1rem' }} />
            </Paper>
        </Grid>
    </Grid>
);

export default function EditTenantPage() {

    const { id } = useParams();
    const { data, loading, error } = useQuery(GET_ONE, { variables: { id } });
    const tenant = data?.tenant;

    return (
        <PageWrapper
            title="Editar Empresa"
            error={error?.message}
            breadCrumbs={{
                links: [
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Empresas', href: paths.dashboard.tenants.root },
                    { name: tenant?.name || '...' }
                ]
            }}
        >
            {loading ? <LoadingForm /> : <TenantForm currentTenant={tenant} />}
        </PageWrapper>
    );
}