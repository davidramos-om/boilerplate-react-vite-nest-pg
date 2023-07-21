import { useQuery } from '@apollo/client';
import { Skeleton, Grid, Paper } from '@mui/material';

import PageWrapper from 'src/components/PageWrapper';
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook/use-params';
import UserForm from 'src/sections/manage-users/user-form'
import { GET_ONE } from 'src/sections/manage-users/gql';

const LoadingForm = () => (
    <Grid container spacing={2}>
        <Grid item xs={6}>
            <Paper elevation={0} variant="outlined" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Skeleton variant="circular" width={200} height={200} />
                </div>

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

export default function EditUserPage() {

    const { id } = useParams();
    const { data, loading, error } = useQuery(GET_ONE, { variables: { id } });
    const user = data?.user;

    return (
        <PageWrapper
            title="Editar usuario"
            error={error?.message}
            breadCrumbs={{
                links: [
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Usuarios', href: paths.dashboard.users.root },
                    { name: user?.fullName || '...' }
                ]
            }}
        >
            {loading ? <LoadingForm /> : <UserForm currentUser={user} />}
        </PageWrapper>
    );
}