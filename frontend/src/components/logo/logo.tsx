import { forwardRef } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Link from '@mui/material/Link';
import RouterLink from 'src/routes/router-link';

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(({ disabledLink = false, sx, ...other }, ref) => {


  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        // height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <Box
        component="img"
        alt="logo"
        src="/logo/logo_single.png"
        sx={{ width: 60, height: 35, cursor: 'pointer', ...sx }}
      />
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
}
);

export default Logo;
