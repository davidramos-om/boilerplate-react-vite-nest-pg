import { m } from 'framer-motion';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/hooks/use-auth-context'
import RouterLink from 'src/routes/router-link';
import { MotionContainer, varBounce } from 'src/components/animate';
import { PageNotFoundIllustration } from 'src/assets/illustrations';
import { paths } from "src/routes/paths";

export default function NotFoundView() {

  const { isAuthenticated } = useAuthContext();

  return (
    <MotionContainer>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" paragraph>
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          Es posible que hayas escrito mal la dirección o que la página se haya movido.
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <PageNotFoundIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
      </m.div>

      <Button component={RouterLink} href={paths.dashboard.root} size="large" variant="contained">
        Volver al inicio
      </Button>
      {!isAuthenticated && (
        <Button
          component={RouterLink}
          href={paths.auth.portal}
          size="large"
          variant="outlined"
          sx={{ ml: 2 }}
        >
          Iniciar sesión
        </Button>
      )}
    </MotionContainer>
  );
}
