import { useQuery } from '@apollo/client';
import { Skeleton, Grid, Paper } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook/use-params';
import PageWrapper from 'src/components/PageWrapper';
import AlertMessage from 'src/components/AlertMessage';
import OnboardingRequestDetails from 'src/sections/onboarding-requests/DetailsForm';
import { GET_ONE } from 'src/sections/onboarding-requests/gql';

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

export default function ViewOnboardingRequestPage() {

    const { id } = useParams();
    const { data, loading, error } = useQuery(GET_ONE, { variables: { id } });
    const request = data?.request;

    return (
        <PageWrapper
            title="Detalle de la Solicitud"
            breadCrumbs={{
                links: [
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Solicitudes', href: paths.dashboard.onboarding_requests.root },
                    { name: 'Listado' },
                ]
            }}
        >
            {error && <AlertMessage type="error" message={error.message} />}
            {loading ? <LoadingForm /> : <OnboardingRequestDetails row={request} />}
        </PageWrapper>
    );
}
