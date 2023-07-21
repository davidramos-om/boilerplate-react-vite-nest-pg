import { Button } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import ChangeUserPassword from './change-password-dialog'

type Props = {
    userRowId: string;
    disabled?: boolean;
}

export default function ChangePasswordButton({ userRowId, disabled }: Props) {

    const password = useBoolean();

    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                onClick={password.onTrue}
                startIcon={<Iconify icon="mdi:lock" />}
                disabled={disabled}
            >
                Cambiar contraseña
            </Button>
            <ChangeUserPassword
                userRowId={userRowId}
                open={password.value}
                onClose={password.onFalse}
            />
        </>
    );

}