import { Link, Stack, Typography } from "@mui/material";

import { paths } from 'src/routes/paths'
import Page from 'src/components/Page';
import LoginView from 'src/sections/auth/login-view';
import { USER_TYPE } from "src/types/users";
import { NIL_UUID } from "src/utils/constants";


function InformativeFooter() {

  return (
    <Stack spacing={2} sx={{ mt: 5 }}>
      <Typography variant="body2">
        Usted se esta conectando a la sección administrativa
      </Typography>
      <Typography variant="body2">
        Si desea conectarse al portal corporativo con su empresa, por favor haga click en el siguiente enlace:
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        <Link href={paths.auth.company('')} target="_blank" rel="noopener noreferrer">
          Conectar con mi empresa
        </Link>
      </Typography>
    </Stack>
  );
}

export default function PortalLoginPage() {
  return (
    <Page title="Iniciar sesión">
      <LoginView showHeader showCompanyInput={false} domain={USER_TYPE.PORTAL_ROOT} tenantParam={NIL_UUID} informative={<InformativeFooter />} />
    </Page>
  );
}
