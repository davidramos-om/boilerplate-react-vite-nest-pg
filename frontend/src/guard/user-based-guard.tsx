import { m } from 'framer-motion';
import { Theme, SxProps } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ForbiddenIllustration } from 'src/assets/illustrations';
import { MotionContainer, varBounce } from 'src/components/animate';
import { useAuthContext } from 'src/hooks/use-auth-context'
import { USER_TYPE } from 'src/types/users'

type UserTypeBasedGuardProp = {
  hasContent?: boolean;
  type: USER_TYPE;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function UserTypeBasedGuard({ hasContent, type, children, sx }: UserTypeBasedGuardProp) {

  const { user } = useAuthContext();
  const currentType = user?.userType;

  if (typeof type !== 'undefined' && type !== currentType) {
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Acceso limitado
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Lo sentimos mucho, parece que no tienes suficientes permisos para acceder a esta página, si crees que esto es un error, por favor contacta con tu administrador.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>
      </Container>
    ) : null;
  }

  return <> {children} </>;
}
