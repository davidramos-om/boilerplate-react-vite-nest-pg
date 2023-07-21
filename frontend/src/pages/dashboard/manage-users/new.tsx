import PageWrapper from 'src/components/PageWrapper';
import { paths } from 'src/routes/paths';
import UserForm from 'src/sections/manage-users/user-form'

export default function NewUserPage() {

    return (
        <PageWrapper
            title="Crear nuevo usuario"
            breadCrumbs={{
                links: [
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Usuarios', href: paths.dashboard.users.root },
                    { name: 'Nuevo usuario' },
                ]
            }}
        >
            <UserForm />
        </PageWrapper>
    );
}