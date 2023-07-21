import { useQuery } from '@apollo/client';

import { paths } from 'src/routes/paths'
import PageWrapper from "src/components/PageWrapper";
import AlertMessage from 'src/components/AlertMessage';
import NewRecordButton from 'src/components/buttons/new-record-button';
import TenantsView from 'src/sections/tenants';
import { GET_ALL } from 'src/sections/tenants/gql';

export default function TenantsPage() {

  const { data, loading, error } = useQuery(GET_ALL);

  return (
    <PageWrapper
      title="Empresas"
      breadCrumbs={{
        links: [
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Empresas', href: paths.dashboard.tenants.root },
          { name: 'Listado' },
        ],
        action: <NewRecordButton label="Nueva" href={paths.dashboard.tenants.new} />
      }}
    >
      {error && <AlertMessage type="error" message={error.message} />}
      <TenantsView
        loading={loading}
        rows={data?.tenants || []}
      />
    </PageWrapper>
  );
}
