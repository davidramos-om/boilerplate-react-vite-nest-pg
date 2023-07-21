import { useCallback } from "react";
import { IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';


import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean'
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard'

type Props = {
    content: string;
}

export default function CopyToClipboard({ content }: Props) {

    const { value, onTrue, onFalse } = useBoolean(false);
    const { copy } = useCopyToClipboard();
    const { enqueueSnackbar } = useSnackbar();

    const switchState = useCallback(() => {
        onTrue();
        setTimeout(() => { onFalse() }, 1000);
    }, [ onTrue, onFalse ])


    const handleCopy = useCallback(() => {

        if (!content)
            return;

        if (!copy(content))
            enqueueSnackbar('No soportado', { variant: 'warning' });

        switchState();

    }, [ copy, content, switchState, enqueueSnackbar ]);

    return (
        <Tooltip title={value ? 'Copiado' : 'Copiar'}>
            <IconButton
                size="small"
                color="default"
                onClick={handleCopy}
                disableRipple
                disableFocusRipple
            >
                {value ? <CheckIcon color="success" /> : <ContentCopyIcon />}
            </IconButton>
        </Tooltip>
    )
}