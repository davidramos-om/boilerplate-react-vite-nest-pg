import { Helmet } from 'react-helmet-async';
import { forwardRef, ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';

interface PageProps extends BoxProps {
  children: ReactNode;
  title?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ children, title = '', ...other }, ref) => (
  <Box ref={ref} {...other} id="page-wrapper">
    <Helmet>
      <title>{`${title} | Portal CTPAT`}</title>
    </Helmet>
    {children}
  </Box>
));

export default Page;
