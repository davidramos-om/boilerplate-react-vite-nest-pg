import { Alert, AlertTitle } from '@mui/material';

type Props = {
    type: 'success' | 'info' | 'warning' | 'error'
    title?: string;
    message: string;
    multiline?: boolean;
};

const AlertMessage = ({ message = '', title = '', type, multiline = false }: Props) => (
    <>
        <Alert
            severity={type}
            variant="standard"
            sx={multiline ? { whiteSpace: "pre-wrap" } : {}}
        >
            {title ? <AlertTitle>{title}</AlertTitle> : null}
            {message}
        </Alert>
        <br />
    </>
)

export default AlertMessage;