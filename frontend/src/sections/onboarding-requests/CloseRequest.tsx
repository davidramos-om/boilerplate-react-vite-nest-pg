import { useCallback } from "react";
import { LoadingButton } from "@mui/lab";
import { useMutation } from '@apollo/client';

import { useSnackbar } from 'src/components/snackbar';
import { confirmAlert } from 'src/utils/sweet-alert';
import { MARK_CLOSED } from './gql';

export function CloseRequest({ id, status }: { id: string; status: string; }) {

    const { enqueueSnackbar } = useSnackbar();
    const [ markClosed, { loading, error, called } ] = useMutation(MARK_CLOSED);

    const handleMarkClosed = useCallback(async () => {

        if (status === 'CLOSED')
            return;

        const prompt = await confirmAlert({
            title: 'Confirmar',
            text: 'Una vez cerrada la solicitud, desaparecerá de la lista de solicitudes pendientes. ¿Desea continuar?',
        });

        if (!prompt.isConfirmed)
            return;

        markClosed({ variables: { id } });
        enqueueSnackbar('Solicitud cerrada', { variant: 'success' });

    }, [ id, status, markClosed, enqueueSnackbar ]);


    return (
        <LoadingButton
            variant="contained"
            loading={loading}
            disabled={called || status === 'CLOSED'}
            onClick={handleMarkClosed}
        >
            {error ? 'Error' : ('Cerrar solicitud')}
        </LoadingButton>
    );
}
