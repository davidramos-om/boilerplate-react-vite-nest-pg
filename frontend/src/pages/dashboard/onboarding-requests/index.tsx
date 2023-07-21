import { useQuery } from '@apollo/client';

import { paths } from 'src/routes/paths';
import PageWrapper from 'src/components/PageWrapper';
import AlertMessage from 'src/components/AlertMessage';
import OnboardingRequestView from 'src/sections/onboarding-requests/ListForm';
import { GET_ALL } from 'src/sections/onboarding-requests/gql';

export default function OnboardingRequest() {

  const { data, loading, error } = useQuery(GET_ALL);

  return (
    <PageWrapper
      title="Solicitudes de información"
      breadCrumbs={{
        links: [
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Solicitudes', href: paths.dashboard.onboarding_requests.root },
          { name: 'Listado' },
        ]
      }}
    >
      {error && <AlertMessage type="error" message={error.message} />}
      <OnboardingRequestView
        loading={loading}
        rows={data?.requests || []}
      />
    </PageWrapper>
  );

}
