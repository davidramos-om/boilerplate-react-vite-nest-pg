import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import Iconify from "src/components/iconify/iconify";
import { useSettingsContext } from "./context";

type Props = {
    iconColor?: string;
}

export default function ChangeModeButton({ iconColor }: Props) {

    const settings = useSettingsContext();

    const setSetting = () => {
        settings.onUpdate('themeMode', settings.themeMode === 'light' ? 'dark' : 'light')
    }

    return (
        <Tooltip title={settings.themeMode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
            <IconButton onClick={setSetting}>
                <Iconify
                    icon={settings.themeMode === 'light' ? 'material-symbols:light-mode' : 'material-symbols:dark-mode'}
                    color={iconColor}
                />
            </IconButton>
        </Tooltip>
    )
}