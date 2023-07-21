import PageWrapper from 'src/components/PageWrapper';
import { paths } from 'src/routes/paths';
import TenantForm from 'src/sections/tenants/tenant-form'

export default function NewTenantPage() {

    return (
        <PageWrapper
            title="Crear nueva empresa"
            breadCrumbs={{
                links: [
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Empresas', href: paths.dashboard.tenants.root },
                    { name: 'Nueva empresa' },
                ]
            }}
        >
            <TenantForm />
        </PageWrapper>
    );
}