import { useCallback } from "react";
import * as Yup from 'yup';
import { useMutation, useQuery } from '@apollo/client';

import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, IconButton, InputAdornment, Card, Typography, Box } from '@mui/material';

import FormProvider, { useForm, RHFTextField } from 'src/components/hook-form';
import AlertMessage from "src/components/AlertMessage";
import Iconify from "src/components/iconify";
import Label from "src/components/label/label";

import { confirmAlert, showAlert } from "src/utils/sweet-alert";
import { consoleError, getErrorFromGQL } from "src/utils/errors";
import { USER_TYPE } from "src/types/users";
import { useRouter } from 'src/routes/hook';
import { useBoolean } from "src/hooks/use-boolean";
import { paths } from "src/routes/paths";
import { GET_AUTH_TENANT_BY_SLUG } from "src/sections/tenants/gql";

import { RESET_PASSWORD } from './gql'
import ForgotPassword from "./forgot-password";

type Props = {
    tenantParam: string;
    token: string;
    userId: string;
    domain: USER_TYPE;
}

type FormValuesProps = {
    afterSubmit: string,
    tenantId: string;
    userId: string;
    token: string;
    newPassword: string;
    confirmNewPassword: string;
}

const ResetPasswordSchema = Yup.object().shape({
    tenantId: Yup.string().required('El código de la empresa es requerido'),
    token: Yup.string().required('El código de reinicio es requerido'),
    userId: Yup.string().required('El usuario es requerido'),
    newPassword: Yup.string()
        .required('Ingresar la nueva contraseña')
        .min(4, 'La contraseña debe tener al menos 4 caracteres'),
    confirmNewPassword: Yup.string()
        .required('Ingresar la confirmación de la nueva contraseña')
        .oneOf([ Yup.ref('newPassword') ], 'Las contraseñas no coinciden'),
});

export default function ResetPassword({ tenantParam, domain, token, userId }: Props) {

    const [ resetPassword ] = useMutation(RESET_PASSWORD);
    const password = useBoolean();
    const router = useRouter();
    const { data: tenantData } = useQuery(GET_AUTH_TENANT_BY_SLUG, { variables: { slug: tenantParam } });

    const defaultValues: FormValuesProps = {
        afterSubmit: '',
        tenantId: tenantParam,
        token,
        userId,
        newPassword: '',
        confirmNewPassword: '',
    };

    const methods = useForm({
        resolver: yupResolver(ResetPasswordSchema),
        defaultValues,
    });

    const { watch, handleSubmit, setError, formState: { isSubmitting, errors } } = methods;
    const values = watch();

    const onSubmit = useCallback(async (data: FormValuesProps) => {
        try {
            const prompt = await confirmAlert({
                title: 'Confirmar',
                text: '¿Esta seguro de establecer la contraseña ingresada?',
                cancelLabel: 'No',
                confirmLabel: 'Sí, cambiar contraseña',
            });

            if (!prompt.isConfirmed)
                return;

            const input = {
                userId: data.userId,
                tenantId: data.tenantId,
                token: data.token,
                newPassword: data.newPassword,
            };

            await resetPassword({ variables: { input } });
            await showAlert({
                title: 'Contraseña cambiada',
                text: 'La contraseña se ha cambiado correctamente',
                icon: 'success',
            });

            router.push(domain === USER_TYPE.PORTAL_ROOT ? paths.auth.portal : paths.auth.company(tenantData?.tenant.slug));

        } catch (error) {
            consoleError(error)
            const message = getErrorFromGQL(error);
            setError('afterSubmit', { message });
        }
    }, [ resetPassword, router, domain, setError, tenantData?.tenant.slug ]);

    return (
        <>
            <Typography variant="h3" sx={{ mb: 5 }}>Cambiar contraseña</Typography>
            <Card>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={3} sx={{ p: 3 }}>
                        <Stack spacing={2} direction="row">
                            <Box sx={{ flexGrow: 1 }} />
                            <Label>
                                Código : {values.token}
                            </Label>
                        </Stack>
                        <RHFTextField
                            name="userId"
                            autoComplete="new-password"
                            label="Usuario"
                        />
                        <RHFTextField
                            name="newPassword"
                            label="Nueva contraseña"
                            type={password.value ? 'text' : 'password'}
                            autoComplete="new-password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={password.onToggle} edge="end">
                                            <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            helperText={
                                <Stack component="span" direction="row" alignItems="center">
                                    <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> La contraseña debe tener al menos 4 caracteres
                                </Stack>
                            }
                        />
                        <RHFTextField
                            name="confirmNewPassword"
                            type={password.value ? 'text' : 'password'}
                            label="Confirmar nueva contraseña"
                            autoComplete="new-password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={password.onToggle} edge="end">
                                            <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
                            Cambiar contraseña
                        </LoadingButton>
                    </Stack>
                </FormProvider>
                <Box sx={{ mb: 2 }}>
                    <ForgotPassword
                        label="Solicitar nuevo reinicio de contraseña"
                        domain={domain}
                        tenantId={values.tenantId}
                        tenantSlug={tenantData?.tenant.slug}
                        tenantName={tenantData?.tenant.name}
                        onError={(error) => setError('afterSubmit', { message: error })}
                    />
                </Box>
                {errors.afterSubmit?.message && <AlertMessage multiline type="error" message={errors.afterSubmit.message} />}
            </Card>
        </>
    );
}