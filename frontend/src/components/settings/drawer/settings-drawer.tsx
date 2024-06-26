import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { paper } from 'src/theme/css';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { useSettingsContext } from '../context';
import BaseOptions from './base-option';
import StretchOptions from './stretch-options';
// import PresetsOptions from './presets-options';
import FullScreenOption from './fullscreen-option';

export default function SettingsDrawer() {

  const theme = useTheme();
  const settings = useSettingsContext();

  const labelStyles = {
    mb: 1.5,
    color: 'text.disabled',
    fontWeight: 'fontWeightSemiBold',
  };

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Personalizar
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={settings.onReset}>
          <Badge color="error" variant="dot" invisible={!settings.canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={settings.onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderMode = (
    <div>
      <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
        Apariencia
      </Typography>

      <BaseOptions
        value={settings.themeMode}
        onChange={(newValue: string) => settings.onUpdate('themeMode', newValue)}
        options={[ 'light', 'dark' ]}
        icons={[ 'sun', 'moon' ]}
      />
    </div>
  );

  const renderStretch = (
    <div>
      <Typography
        variant="caption"
        component="div"
        sx={{
          ...labelStyles,
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        Expandir
        <Tooltip title="Sólo disponible en resoluciones grandes > 1600px (xl)">
          <Iconify icon="eva:info-outline" width={16} sx={{ ml: 0.5 }} />
        </Tooltip>
      </Typography>

      <StretchOptions
        value={settings.themeStretch}
        onChange={() => settings.onUpdate('themeStretch', !settings.themeStretch)}
      />
    </div>
  );

  // const renderPresets = (
  //   <div>
  //     <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
  //       Tema
  //     </Typography>

  //     <PresetsOptions
  //       value={settings.themeColorPresets}
  //       onChange={(newValue: string) => settings.onUpdate('themeColorPresets', newValue)}
  //     />
  //   </div>
  // );

  return (
    <Drawer
      anchor="right"
      open={settings.open}
      onClose={settings.onClose}
      slotProps={{
        backdrop: { invisible: true },
      }}
      sx={{
        [ `& .${drawerClasses.paper}` ]: {
          ...paper({ theme, bgcolor: theme.palette.background.default }),
          width: 280,
        },
      }}
    >
      {renderHead}

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          {renderMode}
          {renderStretch}
          {/* {renderPresets} */}
        </Stack>
      </Scrollbar>

      <FullScreenOption />
    </Drawer>
  );
}
