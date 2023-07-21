import { useState } from "react";
import { alpha, useTheme } from '@mui/material/styles';
import { Stack, Box, Typography, Divider, Container, Link, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import Logo from 'src/components/logo';
import Page from 'src/components/Page';
import LoginView from 'src/sections/auth/login-view';

import ChangeMode from 'src/components/settings/ChangeMode'
import { USER_TYPE } from "src/types/users";
import { bgGradient } from 'src/theme/css';
import { useSearchParams } from "src/routes/hook";
import { paths } from "src/routes/paths";
import Label from "src/components/label/label";

export default function CompanyLoginPage() {

  const theme = useTheme();
  const params = useSearchParams();
  const slug = params.get('slug');
  const code = params.get('code');
  const id = params.get('id');
  const name = params.get('name');

  const [ tenant, setTenant ] = useState<any>(null);

  const image = tenant?.logo_url || '/assets/illustrations/illustration_dashboard.png';
  const title = tenant?.name || 'Bienvenido';

  const handleTenantLoaded = (_tenant: any) => {
    setTenant(_tenant);
  }

  const renderSection = (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    }}
    >
      <Stack
        flexGrow={1}
        sx={{
          ...bgGradient({
            color: alpha(
              theme.palette.background.default,
              theme.palette.mode === 'light' ? 0.88 : 0.94
            ),
            imgUrl: '/assets/background/overlay_4.jpg',
          }),
          borderRadius: 1
        }}
      >
        <Box
          sx={{ padding: 3 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <Stack alignItems="flex-start" spacing={2}>
              <Typography
                variant="h3"
                sx={{
                  color: (_theme) => _theme.palette.mode === 'light' ? _theme.palette.info.darker : 'primary.light',
                  textAlign: 'center'
                }}
              >
                {title}
              </Typography>
              {tenant?.id && <Label>{tenant?.code || 'N/C'}</Label>}
            </Stack>
            <Box
              component="img"
              alt="auth"
              src={image}
              sx={{
                maxWidth: 80,
                height: 'auto',
                my: 5,
                borderRadius: 1,
                boxShadow: 10,
              }}
            />
          </Box>
          <Divider />
          <Box sx={{ pt: 3 }}>
            <Typography variant="h4" paragraph>
              Aviso
            </Typography>
            {tenant?.name && (
              <>
                <Typography variant="body1">
                  Conexión al portal de <b>{tenant?.name || ''}</b> - Solamente para acceso autorizado
                </Typography>
                <br />
              </>
            )}
            <Typography variant="body1">
              Usted se esta conectando a la sección corporativa
            </Typography>
            <Typography variant="body2">
              Si desea conectarse al portal administrativo, utilice el siguiente enlace
            </Typography>
            <br />
            <Link
              href={paths.auth.portal}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ir al portal administrativo
            </Link>
            <br />
          </Box>
        </Box>
      </Stack>
    </Box>
  );

  const renderForm = (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    }}
    >
      <Stack alignItems="center" spacing={4}>
        <Logo />
        <Card sx={{ width: 400, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <LoginView
              domain={USER_TYPE.COMPANY_USER}
              tenantParam={slug || code || id || name}
              showHeader={false}
              showCompanyInput
              onTenantLoaded={handleTenantLoaded}
            />
          </CardContent>
        </Card>
      </Stack>

    </Box>
  );

  return (
    <Page title="Iniciar sesión Portal Corporativo">
      <Container
        id="tenant-login"
        disableGutters
        maxWidth={false}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 3,
          }}
        >
          <ChangeMode iconColor="grey.50" />
        </Box>

        <Grid container spacing={2} sx={{ p: 0, m: 0 }}>
          <Grid
            xs={12}
            md={6}
            height="100vh"
            sx={{
              bgcolor: (_theme) => _theme.palette.info.darker,
            }}
          >
            {renderForm}
          </Grid>
          <Grid
            xs={12}
            md={6}
            height="100vh"
            sx={{
              bgcolor: (_theme) => _theme.palette.info.dark,
              p: 4,
            }}
          >
            {renderSection}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
