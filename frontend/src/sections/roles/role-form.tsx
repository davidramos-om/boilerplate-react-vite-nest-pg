
import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@apollo/client';
import LoadingButton from '@mui/lab/LoadingButton';
import { Card, Stack, Box, Divider, Typography } from '@mui/material';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import AlertMessage from "src/components/AlertMessage";
import { useSnackbar } from 'src/components/snackbar';
import SelectTenant from 'src/sections/tenants/select-tenant';

import { confirmAlert } from 'src/utils/sweet-alert'
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { consoleError, getErrorFromGQL } from 'src/utils/errors';

import { IRole, CreateRoleInput, getTenantValue } from 'src/types/roles';
import { useAuthContext } from "src/hooks/use-auth-context";
import UserTypeBasedGuard from 'src/guard/user-based-guard';
import { USER_TYPE } from "src/types/users";

import PermissionList from './permission-list';
import { CREATE_ROLE, UPDATE_ROLE } from './gql';

interface FormValuesProps extends Omit<IRole, 'id' | 'tenant' | 'permissions'> {
    afterSubmit?: string;
    tenant_id: string;
    isNew: boolean;
    permissions: string[];
};

type Props = {
    currentRole?: IRole;
}

const NewRecordSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string().max(400, 'La descripción no debe exceder los 400 caracteres'),
    permissions: Yup.array().min(1, 'Debe seleccionar al menos un permiso'),
});


export default function RoleForm({ currentRole }: Props) {

    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuthContext();
    const [ createRole ] = useMutation(CREATE_ROLE);
    const [ updateRole ] = useMutation(UPDATE_ROLE);

    const defaultValues: FormValuesProps = useMemo(
        () => ({
            afterSubmit: '',
            isNew: !currentRole,
            name: currentRole?.name || '',
            description: currentRole?.description || '',
            tenant_id: getTenantValue(user, currentRole),
            permissions: currentRole?.permissions?.map(p => p.id) || [],
        }), [ currentRole, user ]);


    const methods = useForm<FormValuesProps>({ resolver: yupResolver(NewRecordSchema), defaultValues });
    const { reset, handleSubmit, watch, setValue, formState: { isSubmitting, errors, submitCount }, setError } = methods;
    const values = watch();

    const onSubmit = useCallback(async (data: FormValuesProps) => {

        try {
            const prompt = await confirmAlert({
                title: 'Confirmación',
                text: currentRole ? '¿Estás seguro de actualizar los datos del perfil?' : '¿Estás seguro de crear el nuevo perfil?',
                icon: 'question',
            });

            if (!prompt.isConfirmed)
                return;

            const input: CreateRoleInput = {
                name: data.name,
                description: data.description,
                permissions: data.permissions,
                tenant_id: data.tenant_id
            }

            if (currentRole?.id)
                await updateRole({ variables: { input: { ...input, id: currentRole.id } } });
            else {
                await createRole({ variables: { input } });
            }

            reset();
            enqueueSnackbar(currentRole ? 'Actualización exitosa' : 'Perfil creado exitosamente');
            router.push(paths.dashboard.roles.root);
        } catch (error) {
            consoleError(error);
            enqueueSnackbar('Ha ocurrido un problema, por favor revise los campos del formulario.', { variant: 'error' });
            setError('afterSubmit', { message: getErrorFromGQL(error) });
        }
    }, [ currentRole, enqueueSnackbar, reset, router, setError, updateRole, createRole ]);

    console.log('values', { values });
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            {errors.afterSubmit?.message && <AlertMessage multiline type="error" message={errors.afterSubmit.message} />}
            {submitCount > 0 && errors.permissions?.message && <AlertMessage multiline type="warning" message={errors.permissions.message} />}
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(1, 1fr)',
                    }}
                >
                    <RHFTextField name="name" label="Nombre del perfil" />
                    <RHFTextField name="description" label="Descripción del perfil" multiline rows={4} />
                    <UserTypeBasedGuard type={USER_TYPE.PORTAL_ROOT}>
                        <SelectTenant
                            field="tenant_id"
                            value={values.tenant_id}
                            onChange={(tenantId) => { setValue('tenant_id', tenantId) }}
                        />
                    </UserTypeBasedGuard>
                </Box>
                <Divider sx={{ my: 3 }} >
                    <b>Permisos</b>
                </Divider>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Autorizar el ámbito de acceso asociado a este perfil.
                </Typography>
                <Stack sx={{
                    mt: 3,
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: 1,
                    p: 2,
                }}>
                    <PermissionList />
                </Stack>
                <Divider sx={{ my: 3 }} />

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        {!currentRole ? 'Crear Perfil' : 'Guardar Cambios'}
                    </LoadingButton>
                </Stack>
            </Card>
        </FormProvider>
    );
}