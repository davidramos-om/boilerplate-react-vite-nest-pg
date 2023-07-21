import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { confirmAlert } from 'src/utils/sweet-alert'
import { useAuthContext } from 'src/hooks/use-auth-context';
import { useRouter } from 'src/routes/hook';
import { USER_TYPE } from "src/types/users";
import { paths } from "src/routes/paths";

export default function NavUpgrade() {

  const { user, logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {

      console.log(`🐛  -> 🔥 :  handleLogout 🔥 :  user:`, user);
      const userType = user?.userType || '';
      const tenantSlug = user?.tenantSlug || '#';

      const prompt = await confirmAlert({
        title: 'Cerrar sesión',
        text: '¿Estás seguro de cerrar sesión?',
      });

      if (!prompt.isConfirmed)
        return;

      await logout();

      switch (userType) {
        case USER_TYPE.PORTAL_ROOT:
          router.replace(paths.auth.portal);
          break;
        case USER_TYPE.COMPANY_USER:
          router.replace(paths.auth.company(tenantSlug));
          break;
        default:
          router.replace(paths.auth.portal);
      }

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={user?.picture || '/assets/icons/avatars/woman.png'}
            alt={user?.screenName}
            sx={{
              width: 48,
              height: 48,
              borderColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.grey[ 300 ],
              borderStyle: 'solid',
              borderWidth: 'thin'
            }}
          />
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.screenName || ''}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {`@${user?.userId || ''}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.tenantSlug || ''}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </Stack>
    </Stack>
  );
}
