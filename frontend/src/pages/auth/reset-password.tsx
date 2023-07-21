
import Page from 'src/components/Page';
import AlertMessage from "src/components/AlertMessage";
import ResetPasswordForm from 'src/sections/auth/reset-password';
import { useSearchParams } from 'src/routes/hook/use-search-params';
import { NIL_UUID } from "src/utils/constants";
import { USER_TYPE } from "src/types/users";

export default function ResetPasswordPage() {

    const params = useSearchParams();
    const tenantId = params.get('tenant');
    const token = params.get('token');
    const user = params.get('user');

    return (
        <Page title="Iniciar sesión">
            {(tenantId && token && user) ?
                <ResetPasswordForm
                    tenantParam={tenantId}
                    token={token}
                    userId={user}
                    domain={tenantId === NIL_UUID ? USER_TYPE.PORTAL_ROOT : USER_TYPE.COMPANY_USER}
                />
                : <AlertMessage type="warning" message="La dirección proporcionada es incorrecto o ya no está disponible." />
            }
        </Page>
    );
}