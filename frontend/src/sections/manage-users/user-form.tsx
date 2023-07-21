import * as Yup from 'yup';
import { useMutation } from '@apollo/client'
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, Box, Card, Typography, InputAdornment, IconButton } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths'
import { useRouter } from 'src/routes/hook';
import { useAuthContext } from 'src/hooks/use-auth-context'
import { useSnackbar } from 'src/components/snackbar';
import { AuthenticatedUser } from "src/types/authentication";
import { IUser, CreateUserInput, USER_TYPE, USER_TYPE_OPTIONS } from 'src/types/users';

import AlertMessage from "src/components/AlertMessage";
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { CustomFile } from 'src/components/upload';
import FormProvider, { RHFTextField, RHFUploadAvatar, RHFRadioGroup } from 'src/components/hook-form';
import SelectRoles from 'src/sections/roles/select-many-roles';

import { useUploadPublicFileMutation } from 'src/contexts/graphql/mutations';
import { confirmAlert } from 'src/utils/sweet-alert'
import { consoleError, getErrorFromGQL } from 'src/utils/errors';
import { useBoolean } from "src/hooks/use-boolean";
import SelectTenant from 'src/sections/tenants/select-tenant';
import UserTypeBasedGuard from 'src/guard/user-based-guard';
import { MSG_REGEX_CODE_PATTERN, REGEX_CODE } from "src/utils/constants";
import { getStatusTranslation } from "src/types/status";

import ChangePasswordButton from './change-password-button';
import InactivateUser from './inactivate-user';
import ReactivateUser from './reactivate-user';
import { CREATE_USER, UPDATE_USER } from './gql';

const NewUserSchema = Yup.object().shape({
    isNew: Yup.boolean().default(true),
    user_id: Yup.string().required('Id de usuario es requerido').matches(REGEX_CODE, { message: MSG_REGEX_CODE_PATTERN }),
    email: Yup.string().nullable().when('hasEmail', {
        is: true,
        then: (schema) => schema.email('El correo electrónico es inválido').required('Correo electrónico es requerido'),
        otherwise: (schema) => schema.notRequired(),
    }),
    password: Yup.string().when('isNew', {
        is: true,
        then: (schema) => schema.required('Contraseña es requerida').min(4, 'La contraseña debe tener al menos 4 caracteres'),
    }),
    confirmPassword: Yup.string().when('isNew', {
        is: true,
        then: (schema) => schema.required('Debe confirmar la contraseña').oneOf([ Yup.ref('password') ], 'Las contraseñas deben coincidir'),
    }),
    first_name: Yup.string().required('Nombre es requerido'),
    last_name: Yup.string().required('Apellido es requerido'),
    type: Yup.string().oneOf([ USER_TYPE.COMPANY_USER, USER_TYPE.PORTAL_ROOT ], 'Tipo de usuario invalido').required('Tipo de usuario es requerido'),
    tenant_id: Yup.string().when('type', {
        is: USER_TYPE.COMPANY_USER,
        then: (schema) => schema.required('El usuario debe pertenecer a una empresa'),
    }),
    imagePreview: Yup.mixed().required('Imagen es requerida')
});

interface FormValuesProps extends Omit<CreateUserInput, 'image_url'> {
    imagePreview: CustomFile | string | null;
    isNew: boolean;
    hasEmail: boolean;
    password: string;
    afterSubmit?: string;
    status: string;
    roles: string[];
}

type Props = {
    currentUser?: IUser;
};

const getTenantValue = (user: AuthenticatedUser | null, row: IUser | undefined) => {

    if (user?.userType === USER_TYPE.PORTAL_ROOT) {
        return row?.tenant?.id || '';
    }

    return user?.tenantId || '';
}

export default function UserForm({ currentUser }: Props) {

    const router = useRouter();
    const { user } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const { uploadPublicFile } = useUploadPublicFileMutation();
    const password = useBoolean();
    const [ createUser ] = useMutation(CREATE_USER);
    const [ updateUser ] = useMutation(UPDATE_USER);

    const defaultValues: FormValuesProps = useMemo(
        () => ({
            isNew: !currentUser,
            user_id: currentUser?.user_id || '',
            email: currentUser?.email || '',
            hasEmail: !!currentUser?.email,
            status: currentUser?.status || '',
            password: '',
            confirmPassword: '',
            type: currentUser?.type || USER_TYPE.COMPANY_USER,
            tenant_id: getTenantValue(user, currentUser),
            first_name: currentUser?.first_name || '',
            last_name: currentUser?.last_name || '',
            roles: currentUser?.roles?.map((role: any) => role.role_id) || [],
            imagePreview: currentUser?.image_url || (user?.userType === USER_TYPE.PORTAL_ROOT ? 'https://avatars.githubusercontent.com/u/181381?v=4' : (user?.tenantLogo || ''))
        }),
        [ currentUser, user ]
    );

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
    });

    const { reset, watch, setValue, handleSubmit, formState: { isSubmitting, errors }, setError } = methods;
    const values = watch();

    useEffect(() => {
        setValue('hasEmail', !!values.email);
    }, [ values.email, setValue ]);

    const onSubmit = useCallback(async (data: FormValuesProps) => {
        let imageUrl = '';
        try {
            const prompt = await confirmAlert({
                title: 'Confirmación',
                text: currentUser ? '¿Estás seguro de actualizar los datos del usuario?' : '¿Estás seguro de crear un nuevo usuario?',
                icon: 'question',
            });

            if (!prompt.isConfirmed)
                return;

            //* Set the image in case the user it was uploaded but the second endpoint fails
            if (data.imagePreview !== null && typeof data.imagePreview !== 'string') {
                const file = data.imagePreview as CustomFile;
                const input = { file, folder: 'users' };
                const { data: { result: { url } } } = await uploadPublicFile({ variables: input });
                imageUrl = url;
            }
            else
                imageUrl = data.imagePreview as string;


            const input: CreateUserInput = {
                user_id: data.user_id,
                email: data.email,
                type: data.type,
                tenant_id: data.tenant_id,
                first_name: data.first_name,
                last_name: data.last_name,
                image_url: imageUrl,
                roles: data.roles,
            }

            if (currentUser?.id)
                await updateUser({
                    variables: {
                        input: {
                            ...input,
                            id: currentUser.id
                        }
                    }
                });
            else {
                await createUser({
                    variables: {
                        input: {
                            ...input,
                            password: data.password,
                        }
                    }
                });
            }

            reset();
            enqueueSnackbar(currentUser ? 'Actualización exitosa' : 'Usuario creado exitosamente');
            router.push(paths.dashboard.users.root);
        } catch (error) {
            consoleError(error);
            enqueueSnackbar('Ha ocurrido un problema, por favor revise los campos del formulario.', { variant: 'error' });
            setError('afterSubmit', { message: getErrorFromGQL(error) });
            if (imageUrl)
                setValue('imagePreview', imageUrl, { shouldValidate: true });
        }
    },
        [ currentUser, enqueueSnackbar, reset, router, setError, setValue, uploadPublicFile, updateUser, createUser ]
    );

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[ 0 ];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {
                setValue('imagePreview', newFile, { shouldValidate: true });
            }
        },
        [ setValue ]
    );

    const handleUserDisabled = useCallback(() => {
        setValue('status', 'INACTIVE');
    }, [ setValue ]);

    const handleUserEnabled = useCallback(() => {
        setValue('status', 'ACTIVE');
    }, [ setValue ]);

    return (
        <>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                {errors.afterSubmit?.message && <AlertMessage multiline type="error" message={errors.afterSubmit.message} />}
                <Grid container spacing={3}>
                    <Grid xs={12} md={4}>
                        <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                            {currentUser && (
                                <Label
                                    color={values.status === 'ACTIVE' ? 'success' : 'error'}
                                    sx={{ position: 'absolute', top: 24, right: 24 }}
                                >
                                    {getStatusTranslation(values.status).toUpperCase()}
                                </Label>
                            )}

                            <Box sx={{ mb: 5 }}>
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
                            </Box>
                        </Card>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <Card sx={{ p: 3 }}>
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                            >
                                <RHFTextField name="first_name" label="Nombre" />
                                <RHFTextField name="last_name" label="Apellido" />
                                <RHFTextField
                                    name="user_id"
                                    label="Nombre de usuario"
                                    disabled={!values.isNew}
                                />
                                <RHFTextField name="email" label="Correo" />
                                {values.isNew && (
                                    <>
                                        <RHFTextField
                                            name="password"
                                            label="Contraseña"
                                            type={password.value ? 'text' : 'password'}
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
                                        <RHFTextField
                                            name="confirmPassword"
                                            label="Confirmar Contraseña"
                                            type={password.value ? 'text' : 'password'}
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
                                    </>
                                )}
                                <UserTypeBasedGuard type={USER_TYPE.PORTAL_ROOT}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Tipo de usuario</Typography>
                                        <RHFRadioGroup row spacing={4} name="type" options={USER_TYPE_OPTIONS}
                                            onChange={(e) => {
                                                setValue('type', e.target.value as USER_TYPE);
                                                setValue('tenant_id', '')
                                                setValue('roles', [])
                                            }} />
                                    </Stack>
                                    <SelectTenant
                                        field="tenant_id"
                                        disabled={values.type !== USER_TYPE.COMPANY_USER}
                                        value={values.tenant_id}
                                        filter={currentUser ? undefined : (t: any) => t.access_enabled}
                                        onChange={(tenantId) => {
                                            setValue('tenant_id', tenantId);
                                            setValue('roles', [])
                                        }}
                                    />
                                </UserTypeBasedGuard>
                            </Box>

                            <Stack spacing={2} sx={{ mt: 3 }}>
                                <SelectRoles
                                    values={values.roles}
                                    field="roles"
                                    disabled={!values.type || (values.type && values.type === USER_TYPE.COMPANY_USER && !values.tenant_id)}
                                    filterFn={values.type === USER_TYPE.PORTAL_ROOT ? (r) => Boolean(!r.tenant) : (r) => r.tenant?.id === values.tenant_id}
                                    onChange={(roles) => { setValue('roles', roles) }}
                                />
                            </Stack>

                            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                    {!currentUser ? 'Crear usuario' : 'Guardar cambios'}
                                </LoadingButton>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </FormProvider>
            {currentUser && (
                <Card sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Acciones</Typography>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                    >
                        {values.status === 'ACTIVE' ?
                            <InactivateUser userRowId={currentUser.id} onExecuted={handleUserDisabled} /> :
                            <ReactivateUser userRowId={currentUser.id} onExecuted={handleUserEnabled} />
                        }
                        <ChangePasswordButton userRowId={currentUser.id} disabled={values.status !== 'ACTIVE'} />
                    </Stack>
                </Card>
            )}
        </>
    );
}