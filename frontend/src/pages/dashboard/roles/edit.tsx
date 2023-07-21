import { useQuery } from '@apollo/client';
import { Skeleton, Grid, Paper } from '@mui/material';

import PageWrapper from 'src/components/PageWrapper';
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook/use-params';
import RoleForm from 'src/sections/roles/role-form'
import { GET_ONE } from 'src/sections/roles/gql';

const LoadingForm = () => (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <Paper elevation={0} variant="outlined" style={{ padding: '1rem' }}>
                <Skeleton variant="text" width="100%" height={60} style={{ marginBottom: '1rem' }} />
                <Skeleton variant="rectangular" width="100%" height={120} style={{ marginBottom: '1rem' }} />
                <Skeleton variant="text" width="100%" height={60} style={{ marginBottom: '1rem' }} />
                <Skeleton variant="rectangular" width="100%" height={400} style={{ marginBottom: '1rem' }} />
            </Paper>
        </Grid>
    </Grid>
);

export default function EditRolePage() {

    const { id } = useParams();
    const { data, loading, error } = useQuery(GET_ONE, { variables: { id } });
    const role = data?.role;

    return (
        <PageWrapper
            title="Editar perfil de usuario"
            error={error?.message}
            breadCrumbs={{
                links: [
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Perfiles de usuario', href: paths.dashboard.roles.root },
                    { name: role?.name || '...' }
                ]
            }}
        >
            {loading ? <LoadingForm /> : <RoleForm currentRole={role} />}
        </PageWrapper>
    );
}