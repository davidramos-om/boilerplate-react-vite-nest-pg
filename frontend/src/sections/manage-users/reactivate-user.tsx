import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation } from '@apollo/client';

import { useSnackbar } from 'src/components/snackbar';
import { confirmAlert } from 'src/utils/sweet-alert';

import { REACTIVATE_USER } from './gql'

type Props = {
    userRowId: string;
    onExecuted?: () => void;
}

export default function ReactivateUser({ userRowId, onExecuted }: Props) {

    const [ reactivateUser, { loading } ] = useMutation(REACTIVATE_USER, { variables: { id: userRowId } });
    const { enqueueSnackbar } = useSnackbar();

    const handleReactivate = async () => {

        try {

            const prompt = await confirmAlert({
                title: 'Confirmar',
                text: 'Al reactivar el usuario, este podrá iniciar sesión en la plataforma. ¿Desea continuar?',
            });

            if (!prompt.isConfirmed)
                return;

            await reactivateUser();
            enqueueSnackbar('Usuario reactivado', { variant: 'success' });
            onExecuted?.();
        }
        catch (error) {
            enqueueSnackbar(error?.message, { variant: 'error' });
        }
    }

    return (
        <LoadingButton
            variant="soft"
            color="success"
            loading={loading}
            onClick={handleReactivate}
        >
            Reactivar
        </LoadingButton>
    );
}