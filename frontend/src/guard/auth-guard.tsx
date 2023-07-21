import { useEffect, useCallback, useState } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { useAuthContext } from 'src/hooks/use-auth-context';

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {

  const router = useRouter();
  const { isAuthenticated, } = useAuthContext();
  const [ checked, setChecked ] = useState(false);

  const check = useCallback(() => {

    if (!isAuthenticated) {

      const searchParams = new URLSearchParams({ returnTo: window.location.href }).toString();

      const href = `${paths.auth.portal}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [ isAuthenticated, router ]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
