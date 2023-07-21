import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Divider } from "@mui/material";

import ChangeMode from "src/components/settings/ChangeMode";
import { useResponsive } from 'src/hooks/use-responsive';
import { bgGradient } from 'src/theme/css';

type Props = {
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children }: Props) {

  const theme = useTheme();
  const upMd = useResponsive('up', 'md');

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        py: { xs: 15, md: 30 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      spacing={10}
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: theme.palette.mode === 'dark' ? '/assets/background/overlay_2.jpg' : '/assets/background/overlay_1.svg',
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        Bienvenido
      </Typography>

      <Typography
        variant="body1"
        sx={{
          maxWidth: 480,
          textAlign: 'center',
          color: theme.palette.text.secondary,
        }}
      >
        Usted se esta conectando a la sección administrativa, asegurese de tener los permisos necesarios para acceder a esta plataforma.
      </Typography>
      <Divider sx={{ width: '100%', maxWidth: 480 }} />
      <Box
        component="img"
        alt="auth"
        src="/logo/logo_full.png"
        sx={{ maxWidth: 720 }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          p: 3,
        }}
      >
        <ChangeMode />
      </Box>
      {upMd && renderSection}
      {renderContent}
    </Stack>
  );
}
