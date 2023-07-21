import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@apollo/client';

import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { confirmAlert } from 'src/utils/sweet-alert';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { ASSIGN_PASSWORD } from './gql';

type FormValuesProps = {
    afterSubmit: string,
    newPassword: string;
    confirmNewPassword: string;
}

type Props = {
    open: boolean;
    userRowId: string;
    onClose: () => void;
}

export default function ChangeUserPassword({ open, userRowId, onClose, }: Props) {

    const { enqueueSnackbar } = useSnackbar();
    const password = useBoolean();
    const [ assignPassword ] = useMutation(ASSIGN_PASSWORD);

    const ChangePassWordSchema = Yup.object().shape({
        newPassword: Yup.string()
            .required('Ingresar la nueva contraseña')
            .min(4, 'La contraseña debe tener al menos 4 caracteres'),
        confirmNewPassword: Yup.string().oneOf([ Yup.ref('newPassword') ], 'Las contraseñas no coinciden'),
    });

    const defaultValues: FormValuesProps = {
        afterSubmit: '',
        newPassword: '',
        confirmNewPassword: '',
    };

    const methods = useForm({
        resolver: yupResolver(ChangePassWordSchema),
        defaultValues,
    });

    const { reset, handleSubmit, setValue, formState: { isSubmitting } } = methods;

    const onSubmit = useCallback(async (data: FormValuesProps) => {
        try {

            const prompt = await confirmAlert({
                title: 'Confirmar',
                text: '¿Está seguro que desea cambiar la contraseña del usuario?'
            });

            if (!prompt.isConfirmed)
                return;

            const input = {
                userRowId,
                password: data.newPassword,
            };

            await assignPassword({ variables: { input } })
            reset();
            enqueueSnackbar('Contraseña cambiada correctamente', { variant: 'success' });
            onClose();
        } catch (error) {
            setValue('afterSubmit', error.message);
            enqueueSnackbar(error.message, { variant: 'error' });
            console.error(error);
        }
    }, [ enqueueSnackbar, reset, setValue, assignPassword, userRowId, onClose ]);


    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
                Asignar nueva contraseña
            </DialogTitle>
            <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={3} sx={{ p: 3 }}>
                        <RHFTextField
                            name="newPassword"
                            label="Nueva contraseña"
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

                        <DialogActions>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
                                Cambiar contraseña
                            </LoadingButton>
                        </DialogActions>
                    </Stack>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}