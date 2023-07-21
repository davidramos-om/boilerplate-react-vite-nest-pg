import PageWrapper from 'src/components/PageWrapper';
import { paths } from 'src/routes/paths';
import RoleForm from 'src/sections/roles/role-form'

export default function NeRolePage() {

    return (
        <PageWrapper
            title="Crear nuevo perfil de usuario"
            breadCrumbs={{
                links: [
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Perfiles de usuario', href: paths.dashboard.roles.root },
                    { name: 'Nuevo Perfil' },
                ]
            }}
        >
            <RoleForm />
        </PageWrapper>
    );
}