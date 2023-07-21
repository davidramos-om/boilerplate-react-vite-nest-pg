import { useQuery } from '@apollo/client';

import ManageUsersView from 'src/sections/manage-users';
import AlertMessage from 'src/components/AlertMessage';
import PageWrapper from 'src/components/PageWrapper';
import NewRecordButton from 'src/components/buttons/new-record-button';
import { paths } from 'src/routes/paths';
import { GET_ALL } from 'src/sections/manage-users/gql';

export default function ManageUsersPage() {

  const { data, loading, error } = useQuery(GET_ALL, { fetchPolicy: 'cache-and-network' });

  return (
    <PageWrapper
      title="Gestión de usuarios"
      breadCrumbs={{
        links: [
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Usuarios', href: paths.dashboard.users.root },
          { name: 'Listado' },
        ],
        action: <NewRecordButton label="Nuevo" href={paths.dashboard.users.new} />
      }}
    >
      {error && <AlertMessage type="error" message={error.message} />}
      <ManageUsersView
        loading={loading}
        rows={data?.users || []}
      />
    </PageWrapper>

  );
}
