import { Box, Link, Stack, Button, Divider, Typography, Paper } from '@mui/material';
import { m, AnimatePresence } from 'framer-motion';

import { TenantCompleteIllustration } from 'src/assets/illustrations';
import Page from 'src/components/Page';
import Iconify from 'src/components/iconify';
import { varFade } from 'src/components/animate';
import { paths } from 'src/routes/paths'
import { useParams } from 'src/routes/hook'
import RouterLink from 'src/routes/router-link'

export default function TenantCreatedPage() {

    const { slug } = useParams();
    const loginLink = paths.auth.company(slug || '#');
    const loginFullLink = `${window.location.origin}${loginLink}`;


    const renderContent = (
        <Stack
            spacing={5}
            py={10}
            sx={{
                m: 'auto',
                maxWidth: 480,
                textAlign: 'center',
                px: { xs: 2, sm: 0 },
            }}
        >
            <Typography variant="h4">Empresa creada con éxito.</Typography>

            <TenantCompleteIllustration sx={{ height: 290 }} />

            <Typography>
                Comparta el siguiente enlace con el administrador de la empresa para que pueda iniciar sesión.
                <br />
                <br />
                <br />
                <Link
                    href={loginFullLink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {loginFullLink}
                </Link>
                <br />
                <br />
                Un correo electrónico con el enlace de inicio de sesión también se ha enviado al administrador de la empresa.
                <br /><br /> Si el enlace no funciona, revise los datos de la empresa y vuelva a intentarlo.
            </Typography>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack
                spacing={2}
                justifyContent="space-between"
                direction={{ xs: 'column-reverse', sm: 'row' }}
            >
                <Button
                    component={RouterLink}
                    fullWidth
                    size="large"
                    color="inherit"
                    href={paths.dashboard.tenants.root}
                    variant="outlined"
                    startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                >
                    Regresar
                </Button>
            </Stack>
        </Stack>
    );

    return (
        <Page title="Empresa creada con éxito">
            <AnimatePresence>
                <Box
                    component={m.div}
                    {...varFade({
                        distance: 120,
                        durationIn: 0.32,
                        durationOut: 0.24,
                        easeIn: 'easeInOut',
                    }).inUp}
                    sx={{
                        width: 1,
                        height: 1,
                        p: { md: 3 },
                    }}
                >
                    <Paper>

                        {renderContent}
                    </Paper>
                </Box>
            </AnimatePresence>
        </Page>
    );
}