import { useQuery } from '@apollo/client';

import ManageRolesView from 'src/sections/roles';
import AlertMessage from 'src/components/AlertMessage';
import PageWrapper from 'src/components/PageWrapper';
import NewRecordButton from 'src/components/buttons/new-record-button';
import { paths } from 'src/routes/paths';
import { GET_ALL } from 'src/sections/roles/gql';

export default function ManageRolesPage() {

    const { data, loading, error } = useQuery(GET_ALL, { fetchPolicy: 'cache-and-network' });

    return (
        <PageWrapper
            title="Gestión de perfiles de usuario"
            breadCrumbs={{
                links: [
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Perfiles de usuario', href: paths.dashboard.roles.root },
                    { name: 'Listado' },
                ],
                action: <NewRecordButton label="Nuevo" href={paths.dashboard.roles.new} />
            }}
        >
            {error && <AlertMessage type="error" message={error.message} />}
            <ManageRolesView
                loading={loading}
                rows={data?.roles || []}
            />
        </PageWrapper>

    );
}
