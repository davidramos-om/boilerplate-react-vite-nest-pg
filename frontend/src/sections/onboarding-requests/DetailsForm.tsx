import { Avatar, Box, Card, Divider, ListItemText, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { useAuthContext } from 'src/hooks/use-auth-context'
import { getStatusTranslation } from "src/types/status";
import { fDate } from "src/utils/format-time";

import Iconify from "src/components/iconify";
import Label from "src/components/label/label";

import { CloseRequest } from "./CloseRequest";
import { MarkAsRead } from "./MarkAsRead";

type Props = {
    row: any;
}

const SVG_SRC = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M22 17.002a6.002 6.002 0 0 1-4.713 5.86l-.638-1.914A4.003 4.003 0 0 0 19.465 19H17a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.938a8.001 8.001 0 0 0-15.876 0H7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5C2 6.477 6.477 2 12 2s10 4.477 10 10v5.002Z"%2F%3E%3C%2Fsvg%3E';

export default function OnboardingRequestDetailsSection({ row }: Props) {

    const { user } = useAuthContext();
    const { code, company, message, created_at, updated_at, updated_by, fullName, phone, email, address, status } = row || {};

    const renderContent = (
        <Stack
            component={Card}
            spacing={3}
            sx={{
                p: 3,
                height: {
                    md: 570
                }
            }} >
            <Typography variant="h4">{company}</Typography>
            <Divider />
            <Typography variant="h6">Mensaje:</Typography>
            <Typography variant="body1">{message}</Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Stack spacing={2}>
                <Typography variant="h6">Estado previo</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Label
                        variant="soft"
                        color={status === 'UNREAD' ? 'error' : 'default'}
                    >
                        {getStatusTranslation(status)}
                    </Label>
                </Stack>
            </Stack>

            <Divider />
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <CloseRequest id={row.id} status={status} />
                </Stack>
            </Stack>
        </Stack>
    );

    const renderOverview = (
        <Stack
            component={Card}
            spacing={2} sx={{ p: 3 }}
        >
            {[
                {
                    label: 'Código',
                    value: code,
                    icon: <Iconify icon="mdi:identifier" />,
                },
                {
                    label: 'Fecha creación',
                    value: fDate(created_at),
                    icon: <Iconify icon="solar:calendar-date-bold" />,
                },
                {
                    label: 'Contacto',
                    value: fullName,
                    icon: <Iconify icon="mdi:contact" />,
                },
                {
                    label: 'Teléfono',
                    value: phone,
                    icon: <Iconify icon="solar:phone-bold" />,
                },
                {
                    label: 'Correo electrónico',
                    value: email,
                    icon: <Iconify icon="ic:baseline-email" />,
                },
                {
                    label: 'Visualizado',
                    value: `${fDate(updated_at)} por ${updated_by || user?.userId || ''}`,
                    icon: <Iconify icon="solar:calendar-date-bold" />,
                },
            ].map((item) => (
                <Stack key={item.label} spacing={1.5} direction="row">
                    {item.icon}
                    <ListItemText
                        primary={item.label}
                        secondary={item.value}
                        primaryTypographyProps={{
                            typography: 'body2',
                            color: 'text.secondary',
                            mb: 0.5,
                        }}
                        secondaryTypographyProps={{
                            typography: 'subtitle2',
                            color: 'text.primary',
                            component: 'span',
                        }}
                    />
                </Stack>
            ))}
        </Stack>
    );


    const renderCompany = (
        <Stack
            component={Paper}
            variant="outlined"
            spacing={2}
            direction="row"
            sx={{ p: 3, borderRadius: 2, mt: 3 }}
        >
            <Avatar
                alt="Empresa"
                src={SVG_SRC}
                variant="rounded"
                sx={{ width: 64, height: 64 }}
            />

            <Stack spacing={1}>
                <Typography variant="subtitle1">{company || ''}</Typography>
                <Typography variant="body2">{address || ''}</Typography>
                <Typography variant="body2">{phone || ''}</Typography>
            </Stack>
        </Stack>
    );

    return (
        <>
            <MarkAsRead id={row?.id} status={status} />
            <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                    {renderContent}
                </Grid>

                <Grid xs={12} md={4}>
                    {renderOverview}

                    {renderCompany}
                </Grid>
            </Grid>
        </>
    );
}