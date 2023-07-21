import { Breakpoint, SxProps, Theme } from "@mui/material";
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { HeaderSimple as Header } from '../_common';

type Props = {
  children: React.ReactNode;
  maxWidth?: number | string;
  containerWidth?: Breakpoint | false
  containerSx?: SxProps<Theme>
};

export default function CompactLayout({ children, maxWidth = 400, containerWidth = "lg", containerSx }: Props) {
  return (
    <>
      <Header />

      <Container
        id="compact-layout"
        maxWidth={containerWidth}
        component="main"
        sx={containerSx}
      >
        <Stack
          sx={{
            py: 12,
            m: 'auto',
            maxWidth,
            minHeight: '100vh',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </Stack>
      </Container>
    </>
  );
}
