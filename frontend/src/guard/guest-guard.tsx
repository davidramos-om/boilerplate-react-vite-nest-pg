import { useCallback, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { useAuthContext } from 'src/hooks/use-auth-context';

type GuestGuardProps = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {

  const router = useRouter();
  const { isAuthenticated } = useAuthContext();

  const check = useCallback(() => {
    if (isAuthenticated) {
      router.replace(paths.dashboard.root);
    }
  }, [ isAuthenticated, router ]);

  useEffect(() => {
    check();
  }, [ check ]);

  return <>{children}</>;
}
