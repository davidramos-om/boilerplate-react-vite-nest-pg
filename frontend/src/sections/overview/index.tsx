import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from "src/components/settings";
import AnalyticsWidgetSummary from 'src/sections/widgets/analytics-widget-summary';
import { PermissionRequiredGuard } from 'src/guard';

const emojis = [ '✨', '🌙', '☀️' ];

export default function OverviewAnalyticsView() {

    const settings = useSettingsContext();
    const time = new Date().getHours();

    // eslint-disable-next-line no-nested-ternary
    const emoji = emojis[ time < 12 ? 2 : time < 18 ? 1 : 0 ];

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <PermissionRequiredGuard hasContent reqPermission="PORTAL_DASHBOARD_PAGE">
                <Typography
                    variant="h4"
                    sx={{
                        mb: { xs: 3, md: 5 },
                    }}
                >
                    Hola nuevamente! {emoji}
                </Typography>

                <Grid container spacing={3}>
                    <Grid xs={12} sm={6} md={3}>
                        <AnalyticsWidgetSummary
                            title="Empresas"
                            total={20}
                            color="success"
                            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
                        />
                    </Grid>


                    <Grid xs={12} sm={6} md={3}>
                        <AnalyticsWidgetSummary
                            title="Solicitud de Servicios"
                            total={10}
                            color="error"
                            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={3}>
                        <AnalyticsWidgetSummary
                            title="Mensajes"
                            total={17215}
                            color="warning"
                            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={3}>
                        <AnalyticsWidgetSummary
                            title="Usuarios"
                            total={15}
                            color="info"
                            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
                        />
                    </Grid>
                </Grid>
            </PermissionRequiredGuard>
        </Container>
    );
}