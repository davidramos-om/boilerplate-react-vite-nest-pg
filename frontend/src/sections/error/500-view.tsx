import { m } from 'framer-motion';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { SeverErrorIllustration } from 'src/assets/illustrations';
import RouterLink from 'src/routes/router-link';
import { MotionContainer, varBounce } from 'src/components/animate';

export default function Page500() {
  return (
    <MotionContainer>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" paragraph>
          500 Internal Server Error
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          There was an error, please try again later.
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
      </m.div>

      <Button component={RouterLink} href="/" size="large" variant="contained">
        Go to Home
      </Button>
    </MotionContainer>
  );
}
