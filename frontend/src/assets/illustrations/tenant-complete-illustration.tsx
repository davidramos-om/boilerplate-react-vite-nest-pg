import { memo } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import BackgroundShape from './background-shape';

function TenantCompleteIllustration({ ...other }: BoxProps) {

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox="0 0 480 360"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <BackgroundShape />
      <image href="/assets/illustrations/risk-management-1.svg" height="400" x="25" />
    </Box>
  );
}

export default memo(TenantCompleteIllustration);
