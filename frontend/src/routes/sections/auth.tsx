import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

import { GuestGuard } from 'src/guard';
import CompactLayout from 'src/layouts/compact';
import AuthPortalLayout from 'src/layouts/auth/portal-login';

const PortalLoginPage = lazy(() => import('src/pages/auth/portal-login'));
const TenantLoginPage = lazy(() => import('src/pages/auth/tenant-login'));
const ResetPasswordPage = lazy(() => import('src/pages/auth/reset-password'));
const JwtRegisterPage = lazy(() => import('src/pages/auth/register'));

const authentication = {
  path: 'guest',
  element: (
    <GuestGuard>
      <Outlet />
    </GuestGuard>
  ),
  children: [
    {
      path: 'portal',
      element: (
        <AuthPortalLayout>
          <PortalLoginPage />
        </AuthPortalLayout>
      ),
    },
    {
      path: 'company',
      element: (
        <TenantLoginPage />
      ),
    },
    {
      path: 'register',
      element: (
        <AuthPortalLayout>
          <JwtRegisterPage />
        </AuthPortalLayout>
      ),
    },
    {
      path: 'reset-password',
      // children: [
      //   {
      //     path: ':tenantId/:token',
      //     index: true,
      //     element: (
      //       <CompactLayout>
      //         <ResetPasswordPage />
      //       </CompactLayout>
      //     )
      //   }
      // ]
      element: (
        <CompactLayout>
          <ResetPasswordPage />
        </CompactLayout>
      )
    }
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    children: [ authentication ],
  },
];
