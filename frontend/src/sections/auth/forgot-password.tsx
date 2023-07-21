import { ChangeEvent, useState } from "react";
import { TextField, Button, Link, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Box } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { useMutation } from '@apollo/client'

import Label from "src/components/label/label";
import { useBoolean } from 'src/hooks/use-boolean'
import { useDebounce } from 'src/hooks/use-debounce'
import { NIL_UUID } from "src/utils/constants";
import { showAlert } from "src/utils/sweet-alert";
import { USER_TYPE } from "src/types/users";

import { FORGOT_PASSWORD } from './gql'

type Props = {
    label: string;
    domain: USER_TYPE;
    tenantId: string;
    tenantSlug: string;
    tenantName: string;
    onError?: (error: string) => void;
    onSucess?: () => void;
}

export default function ForgotPassword({ label, domain, tenantId, tenantSlug, tenantName, onError, onSucess }: Props) {

    const { value, onFalse, onTrue } = useBoolean(false);
    const [ userId, setUserId ] = useState<string | null>(null)
    const debouncedValue = useDebounce<string | null>(userId, 500)
    const [ formError, setFormError ] = useState<string | null>(null)
    const fromPortal = domain === USER_TYPE.PORTAL_ROOT;

    const [ forgotPassword, { loading } ] = useMutation(FORGOT_PASSWORD);

    const handleOpenModal = () => {

        switch (domain) {
            case USER_TYPE.COMPANY_USER:
                if (!tenantId) {
                    onError?.('Ingrese un código válido de su empresa antes de continuar')
                    return;
                }
                break;
            default:
                if (tenantId !== NIL_UUID) {
                    onError?.('Solo válido para usuarios administrativos');
                    return;
                }
        }

        onTrue();
    }

    const handleClose = () => {
        onFalse();
    }

    const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserId(event.target.value)
    }

    const handleSubmit = async () => {
        try {

            if (!debouncedValue) {
                setFormError('Ingresar un usuario válido');
                return;
            }

            const input = {
                tenantId,
                userId: debouncedValue,
            }

            setFormError(null);
            await forgotPassword({ variables: { input } });
            await showAlert({
                title: 'Solicitud enviada',
                text: 'Hemos enviado un correo electrónico con instrucciones para recuperar su contraseña. Revisa en tu bandeja de entrada o correo no deseado',
            });
            onSucess?.();
            handleClose();
        }
        catch (error) {
            await showAlert({
                title: 'Alerta',
                text: error.message || 'Error al enviar solicitud',
                icon: 'warning',
            });
        }
    }

    return (
        <>
            <Link
                variant="body2"
                color="inherit"
                underline="hover"
                sx={{
                    alignSelf: 'flex-end',
                    cursor: 'pointer',
                }}
                onClick={handleOpenModal}
            >
                {label}
            </Link>
            <Dialog open={value} onClose={onFalse}>
                <DialogTitle>
                    <Stack direction="row" spacing={1}>
                        Recuperar contraseña
                        <Box sx={{ flexGrow: 1 }} />
                        {fromPortal ? <Label>Portal</Label> : (Boolean(tenantSlug) && <Label>{tenantSlug}</Label>)}
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText paragraph>
                        {fromPortal ?
                            <span>El nombre de usuario debe estar asociado a un correo electrónico</span> :
                            <span>Por favor ingresa tu nombre de usuario para recuperar tu contraseña, tu usuario debe estar asociado a la empresa <b>{tenantName}</b> </span>
                        }
                    </DialogContentText>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        id="userId"
                        label={formError || "Nombre de usuario"}
                        type="text"
                        variant="outlined"
                        value={userId}
                        onChange={handleValueChange}
                        autoComplete="new-password"
                        error={!!formError}
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={loading}
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>
                    <LoadingButton
                        loading={loading}
                        variant="contained"
                        onClick={handleSubmit}
                    >
                        Continuar
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}