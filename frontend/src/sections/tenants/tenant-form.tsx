import * as Yup from 'yup';
import { useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@apollo/client';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Card, CardHeader, Grid, Stack, Switch, Divider, Typography, InputAdornment, FormControlLabel, Tooltip, Link, useTheme } from '@mui/material';

import FormProvider, { RHFUploadAvatar, RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { CustomFile } from 'src/components/upload';
import AlertMessage from "src/components/AlertMessage";
import CopyToClipboard from 'src/components/buttons/copy-to-clipboard';
import Iconify from "src/components/iconify/iconify";

import { confirmAlert } from 'src/utils/sweet-alert'
import { consoleError, getErrorFromGQL } from 'src/utils/errors';
import { MSG_REGEX_CODE_PATTERN, REGEX_CODE } from "src/utils/constants";
import { useResponsive } from 'src/hooks/use-responsive';
import { ITenant, IAddress } from 'src/types/tenants';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';

import { slugify } from "src/utils/format-text";
import { useUploadPublicFileMutation } from 'src/contexts/graphql/mutations';

import { CREATE_TENANT, UPDATE_TENANT } from './gql';

interface AddressFormValuesProps extends Omit<IAddress, 'id'> { };
interface FormValuesProps extends Omit<ITenant, 'id' | 'billing_address'> {
    imagePreview: CustomFile | string | null;
    afterSubmit?: string;
    billing_address: AddressFormValuesProps;
    isNew: boolean;
    password?: string;
    user_id?: string;
};

type Props = {
    currentTenant?: ITenant;
};

const NewRecordSchema = Yup.object().shape({
    isNew: Yup.boolean().default(true),
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string().max(5000, 'La descripción no debe exceder los 5000 caracteres'),
    code: Yup.string().required('El código es requerido').max(20, 'El código no debe exceder los 20 caracteres'),
    contact_email: Yup.string().required('El correo es requerido').email('El correo electrónico no es válido'),
    contact_name: Yup.string().required('El nombre de contacto es requerido').max(100, 'El nombre de contacto no debe exceder los 100 caracteres'),
    contact_phone: Yup.string().max(20, 'El teléfono no debe exceder los 20 caracteres'),
    address: Yup.string().max(500, 'La dirección no debe exceder los 500 caracteres'),
    subscription_cost: Yup.number().min(0, 'El costo de suscripción debe ser mayor o igual a 0'),
    additional_cost: Yup.number().min(0, 'El costo adicional debe ser mayor o igual a 0'),
    access_enabled: Yup.boolean(),
    imagePreview: Yup.mixed().required('Logo de la empresa es requerido'),
    billing_address: Yup.object().shape({
        address_line_1: Yup.string().max(500, 'La dirección no debe exceder los 500 caracteres'),
        address_line_2: Yup.string().max(500, 'La dirección no debe exceder los 500 caracteres'),
        city: Yup.string().max(100, 'La ciudad no debe exceder los 100 caracteres'),
        state: Yup.string().max(100, 'El estado no debe exceder los 100 caracteres'),
        country: Yup.string().max(100, 'El país no debe exceder los 100 caracteres'),
        zip_code: Yup.string().max(20, 'El código postal no debe exceder los 20 caracteres'),
    }),
    user_id: Yup.string().when('isNew', {
        is: true,
        then: (schema) => schema.required('Debe crear un usuario para la empresa').matches(REGEX_CODE, { message: MSG_REGEX_CODE_PATTERN })
    }),
    password: Yup.string().when('isNew', {
        is: true,
        then: (schema) => schema.required('Contraseña es requerida').min(4, 'La contraseña debe tener al menos 4 caracteres'),
    }),
    confirmPassword: Yup.string().when('isNew', {
        is: true,
        then: (schema) => schema.required('Debe confirmar la contraseña').oneOf([ Yup.ref('password') ], 'Las contraseñas deben coincidir'),
    }),
});

const getFullLoginUrl = (tenantCode: string) => {
    const { origin } = window.location;
    return `${origin}${paths.auth.company(slugify(tenantCode))}`;
}

export default function TenantForm({ currentTenant }: Props) {

    const router = useRouter();
    const mdUp = useResponsive('up', 'md');
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const [ createTenant ] = useMutation(CREATE_TENANT);
    const [ updateTenant ] = useMutation(UPDATE_TENANT);
    const { uploadPublicFile } = useUploadPublicFileMutation();

    const defaultValues: FormValuesProps = useMemo(
        () => ({
            afterSubmit: '',
            isNew: !currentTenant,
            code: currentTenant?.code || '',
            name: currentTenant?.name || '',
            description: currentTenant?.description || '',
            logo_url: currentTenant?.logo_url || '',
            contact_name: currentTenant?.contact_name || '',
            contact_email: currentTenant?.contact_email || '',
            contact_phone: currentTenant?.contact_phone || '',
            address: currentTenant?.address || '',
            subscription_cost: currentTenant?.subscription_cost || 0,
            additional_cost: currentTenant?.additional_cost || 0,
            access_enabled: currentTenant ? Boolean(currentTenant?.access_enabled) : true,
            imagePreview: currentTenant?.logo_url || null,
            user_id: '',
            password: '',
            confirmPassword: '',
            billing_address: {
                address_line_1: currentTenant?.billing_address?.address_line_1 || '',
                address_line_2: currentTenant?.billing_address?.address_line_2 || '',
                city: currentTenant?.billing_address?.city || '',
                state: currentTenant?.billing_address?.state || '',
                country: currentTenant?.billing_address?.country || '',
                zip_code: currentTenant?.billing_address?.zip_code || '',
            }
        }),

        [ currentTenant ]
    );

    const methods = useForm<FormValuesProps>({ resolver: yupResolver(NewRecordSchema), defaultValues });
    const { reset, handleSubmit, watch, setValue, formState: { isSubmitting, errors }, setError } = methods;
    const values = watch();

    useEffect(() => {

        if (currentTenant)
            reset(defaultValues);

    }, [ currentTenant, defaultValues, reset ]);


    const onSubmit = useCallback(async (data: FormValuesProps) => {
        let imageUrl = '';
        try {

            const prompt = await confirmAlert({
                title: 'Confirmación',
                text: currentTenant ? '¿Estás seguro de actualizar este registro?' : '¿Estás seguro de crear este registro?',
                icon: 'question',
            });

            if (!prompt.isConfirmed)
                return;

            //* Set the image in case the user it was uploaded but the second endpoint fails
            if (data.imagePreview !== null && typeof data.imagePreview !== 'string') {
                const file = data.imagePreview as CustomFile;
                const input = { file, folder: 'tenants' };
                const { data: { result: { url } } } = await uploadPublicFile({ variables: input });
                imageUrl = url;
            }
            else
                imageUrl = data.imagePreview as string;

            const input = {
                code: String(data.code || '').toUpperCase(),
                name: data.name,
                description: data.description,
                access_enabled: data.access_enabled,
                subscription_cost: data.subscription_cost,
                address: data.address,
                contact_name: data.contact_name,
                contact_email: data.contact_email,
                contact_phone: data.contact_phone,
                additional_cost: data.additional_cost,
                logo_url: imageUrl,
                billing_address: {
                    address_line_1: data.billing_address.address_line_1,
                    address_line_2: data.billing_address.address_line_2,
                    city: data.billing_address.city,
                    state: data.billing_address.state,
                    country: data.billing_address.country,
                    zip_code: data.billing_address.zip_code,
                }
            }

            let redirectUrl = paths.dashboard.tenants.root;
            if (currentTenant?.id) {
                await updateTenant({
                    variables: {
                        input: {
                            ...input,
                            id: currentTenant.id,
                        }
                    }
                });
            } else {

                const result = await createTenant({
                    variables: {
                        input: {
                            ...input,
                            user_id: data.user_id,
                            password: data.password,
                        }
                    }
                });

                redirectUrl = paths.dashboard.tenants.completed(result.data?.result?.slug);
            }

            reset();
            enqueueSnackbar(currentTenant?.id ? '¡Registro actualizado con éxito!' : '¡Registro creado con éxito!', { variant: 'success' });
            router.push(redirectUrl);
        }
        catch (error) {
            consoleError(error);
            enqueueSnackbar('Ha ocurrido un problema, por favor revise los campos del formulario.', { variant: 'error' });
            setError('afterSubmit', { message: getErrorFromGQL(error) });
            if (imageUrl)
                setValue('imagePreview', imageUrl, { shouldValidate: true });
        }
    },
        [ currentTenant, enqueueSnackbar, reset, router, setValue, createTenant, updateTenant, uploadPublicFile, setError ]
    );

    const handleDrop = useCallback(async (acceptedFiles: File[]) => {

        const file = acceptedFiles[ 0 ];

        const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
        });

        if (file)
            setValue('imagePreview', newFile, { shouldValidate: true });

    }, [ setValue ]);

    const handleSwitchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue('access_enabled', event.target.checked, { shouldValidate: true });
    }, [ setValue ]);

    const loginUrl = useMemo(() => getFullLoginUrl(values.code), [ values.code ]);

    const renderDetails = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Detalles
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Nombre, descripción corta, imagen...
                    </Typography>
                </Grid>
            )}

            <Grid xs={12} md={8}>
                <Card sx={{ m: 1 }}>
                    {!mdUp && <CardHeader title="Detalles" />}

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <RHFTextField name="name" label="Nombre de la empresa" />
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <RHFTextField id="code" name="code" label="Código de empresa" />
                            <Tooltip title="Digite un código único basado en el nombre de la empresa que sea fácil de recordar, este será usado como dirección web para el inicio de sesión corporativo">
                                <Iconify icon="mdi:information-outline" sx={{ mt: 2 }} color={theme.palette.success.main} />
                            </Tooltip>
                        </Stack>
                        {values.code && (SlugLinkInformation(values.access_enabled, loginUrl))}
                        <RHFTextField name="description" label="Información de la empresa" multiline rows={4} />

                        <Stack spacing={1.5}>
                            <Typography variant="subtitle2">Logo de la empresa</Typography>
                            <RHFUploadAvatar
                                name="imagePreview"
                                maxSize={3145728}
                                onDrop={handleDrop}
                                helperText={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 3,
                                            mx: 'auto',
                                            display: 'block',
                                            textAlign: 'center',
                                            color: 'text.disabled',
                                        }}
                                    >
                                        Permitidos *.jpeg, *.jpg, *.png, *.gif
                                    </Typography>
                                }
                            />
                        </Stack>
                    </Stack>
                </Card>
            </Grid>
        </>
    );

    const renderProperties = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Información de contacto
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Correo electrónico, teléfono, dirección...
                    </Typography>
                </Grid>
            )}

            <Grid xs={12} md={8}>
                <Card sx={{ m: 1 }}>
                    {!mdUp && <CardHeader title="Información de contacto" />}

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <Box
                            columnGap={2}
                            rowGap={3}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                md: 'repeat(3, 1fr)',
                            }}
                        >
                            <RHFTextField name="contact_name" label="Persona de contacto" />
                            <RHFTextField name="contact_phone" type="phone" label="Teléfono" />
                            <RHFTextField name="contact_email" type="email" label="Correo electrónico" />
                        </Box>
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        <RHFTextField name="address" label="Dirección" multiline rows={2} maxRows={4} />
                    </Stack>
                </Card>
            </Grid>
        </>
    );

    const renderBilling = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Información de facturación
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Dirección de facturación...
                    </Typography>
                </Grid>
            )}

            <Grid xs={12} md={8}>
                <Card sx={{ m: 1 }}>
                    {!mdUp && <CardHeader title="Información de facturación" />}

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <Box
                            columnGap={2}
                            rowGap={3}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                md: 'repeat(2, 1fr)',
                            }}
                        >
                            <RHFTextField name="billing_address.address_line_1" label="Dirección 1" />
                            <RHFTextField name="billing_address.address_line_2" label="Dirección 2" />
                            <RHFTextField name="billing_address.city" label="Ciudad" />
                            <RHFTextField name="billing_address.state" label="Estado" />
                            <RHFTextField name="billing_address.zip_code" label="Código postal" />
                            <RHFTextField name="billing_address.country" label="País" />
                        </Box>
                    </Stack>
                </Card>
            </Grid>
        </>
    );

    const renderUserAccess = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Acceso
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Definir credenciales de acceso...
                    </Typography>
                </Grid>
            )}

            <Grid xs={12} md={8}>
                <Card sx={{ m: 1 }}>
                    {!mdUp && <CardHeader title="Acceso" />}

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <Box
                            columnGap={2}
                            rowGap={3}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                md: 'repeat(3, 1fr)',
                            }}
                        >
                            <RHFTextField name="user_id" label="Nombre de usuario" />
                            <RHFTextField name="password" label="Contraseña" />
                            <RHFTextField name="confirmPassword" label="Confirmar contraseña" />
                        </Box>
                    </Stack>
                </Card>
            </Grid>
        </>
    );

    const renderPricing = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Precios
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Información de costos...
                    </Typography>
                </Grid>
            )}

            <Grid xs={12} md={8}>
                <Card sx={{ m: 1 }}>
                    {!mdUp && <CardHeader title="Precios" />}

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <RHFTextField
                            name="subscription_cost"
                            label="Costo por servicio"
                            placeholder="0.00"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box component="span" sx={{ color: 'text.disabled' }}>
                                            $
                                        </Box>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <RHFTextField
                            name="additional_cost"
                            label="Costos adicionales"
                            placeholder="0.00"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box component="span" sx={{ color: 'text.disabled' }}>
                                            $
                                        </Box>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                </Card>
            </Grid>
        </>
    );

    const renderActions = (
        <>
            {mdUp && <Grid md={4} />}
            <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                    name="access_enabled"
                    control={<Switch checked={values.access_enabled} onChange={handleSwitchChange} />}
                    label="Acceso a la plataforma activo"
                    sx={{ flexGrow: 1, pl: 3 }}
                />
                <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                >
                    {!currentTenant ? 'Crear empresa' : 'Actualizar datos'}
                </LoadingButton>
            </Grid>
        </>
    );

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            {errors.afterSubmit?.message && <AlertMessage multiline type="error" message={errors.afterSubmit.message} />}
            <Grid container spacing={3}>
                {renderDetails}
                {renderProperties}
                {renderBilling}
                {renderPricing}
                {values.isNew && renderUserAccess}
                {renderActions}
            </Grid>
        </FormProvider>
    );
}
function SlugLinkInformation(access_enabled: boolean, loginUrl: string) {

    return <>
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1}
        >
            <Typography variant="subtitle2">Enlace de acceso : </Typography>
            <Tooltip
                title={<>
                    <Typography paragraph sx={{ color: 'info.main' }}>Información : </Typography>
                    <Typography paragraph>
                        * Los cambios deben ser guardados probar el enlace
                    </Typography>
                    <Typography paragraph>
                        * Abrir enlace en otro navegador o en modo incógnito para probarlo
                    </Typography>
                    <Typography paragraph>
                        <Typography component="span" sx={{ color: 'error.main' }}>Rojo</Typography> Acceso deshabilitado, ni el cliente ni sus usuarios podrá ingresar al portal
                    </Typography>
                    <Typography paragraph>
                        <Typography component="span" sx={{ color: 'success.main' }}>Verde</Typography> Acceso permitido, el cliente y sus usuarios activos podrán ingresar al portal
                    </Typography>
                </>}
            >
                <Link
                    sx={{
                        cursor: 'pointer',
                        color: access_enabled ? 'success.main' : 'error.main',
                    }}
                    href={loginUrl}
                    target="_blank"
                >
                    {loginUrl}
                </Link>
            </Tooltip>
            <CopyToClipboard content={loginUrl} />
        </Stack>
        <Divider sx={{ mb: 4 }} />
    </>;
}

