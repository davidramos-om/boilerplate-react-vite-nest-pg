import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation } from '@apollo/client';

import { useSnackbar } from 'src/components/snackbar';
import { confirmAlert } from 'src/utils/sweet-alert';

import { DEACTIVATE_USER } from './gql'

type Props = {
    userRowId: string;
    onExecuted?: () => void;
}

export default function InactivateUser({ userRowId, onExecuted }: Props) {

    const [ deactivateUser, { loading } ] = useMutation(DEACTIVATE_USER, { variables: { id: userRowId } });
    const { enqueueSnackbar } = useSnackbar();

    const handleInactivate = async () => {

        try {

            const prompt = await confirmAlert({
                title: 'Confirmar',
                text: 'Al desactivar el usuario, este no podrá iniciar sesión en la plataforma. ¿Desea continuar?',
            });

            if (!prompt.isConfirmed)
                return;

            await deactivateUser();
            enqueueSnackbar('Usuario desactivado', { variant: 'success' });
            onExecuted?.();
        }
        catch (error) {

            enqueueSnackbar(error?.message, { variant: 'error' });
        }
    }

    return (
        <LoadingButton
            variant="soft"
            color="error"
            loading={loading}
            onClick={handleInactivate}
        >
            Desactivar
        </LoadingButton>
    );
}