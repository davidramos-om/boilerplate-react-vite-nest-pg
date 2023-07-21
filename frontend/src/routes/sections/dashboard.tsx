import { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard, UserTypeBasedGuard } from 'src/guard';
import DashboardLayout from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';
import { USER_TYPE } from "src/types/users";

const HomePage = lazy(() => import('src/pages/dashboard/portal-home'));
const OnboardingRequest = lazy(() => import('src/pages/dashboard/onboarding-requests'));
const ViewOnboardingRequest = lazy(() => import('src/pages/dashboard/onboarding-requests/view'));

const TenantsPage = lazy(() => import('src/pages/dashboard/tenants'));
const NewTenantPage = lazy(() => import('src/pages/dashboard/tenants/new'));
const EditTenantPage = lazy(() => import('src/pages/dashboard/tenants/edit'));
const NewTenantCreatedPage = lazy(() => import('src/pages/dashboard/tenants/completed'));

const ManageUsersPage = lazy(() => import('src/pages/dashboard/manage-users'));
const NewUserPage = lazy(() => import('src/pages/dashboard/manage-users/new'));
const EditUserPage = lazy(() => import('src/pages/dashboard/manage-users/edit'));

const ManageRolesPage = lazy(() => import('src/pages/dashboard/roles'));
const NewRolePage = lazy(() => import('src/pages/dashboard/roles/new'));
const EditRolePage = lazy(() => import('src/pages/dashboard/roles/edit'));

const PageFour = lazy(() => import('src/pages/dashboard/four'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      {
        element: <HomePage />, index: true,
      },
      {
        path: 'tenants',
        children: [
          {
            element: <UserTypeBasedGuard hasContent type={USER_TYPE.PORTAL_ROOT}><TenantsPage /> </UserTypeBasedGuard>, index: true,
          },
          { path: ':slug/completed', element: <NewTenantCreatedPage /> },
          {
            path: 'new',
            element: <UserTypeBasedGuard hasContent type={USER_TYPE.PORTAL_ROOT}><NewTenantPage /> </UserTypeBasedGuard>,
          },
          {
            path: ':id/edit',
            element: <UserTypeBasedGuard hasContent type={USER_TYPE.PORTAL_ROOT}><EditTenantPage /> </UserTypeBasedGuard>,
          }
        ]
      },
      {
        path: 'onboarding-requests',
        children: [
          { element: <UserTypeBasedGuard hasContent type={USER_TYPE.PORTAL_ROOT}><OnboardingRequest /> </UserTypeBasedGuard>, index: true },
          { path: ':id/view', element: <UserTypeBasedGuard hasContent type={USER_TYPE.PORTAL_ROOT}><ViewOnboardingRequest /> </UserTypeBasedGuard> },
        ]
      },
      {
        path: 'users',
        children: [
          {
            index: true,
            element: <ManageUsersPage />
          },
          { path: 'new', element: <NewUserPage /> },
          { path: ':id/edit', element: <EditUserPage /> },
        ],
      },
      {
        path: 'roles',
        children: [
          { element: <ManageRolesPage />, index: true },
          { path: 'new', element: <NewRolePage />, },
          { path: ':id/edit', element: <EditRolePage />, }
        ],
      },
      {
        path: 'group',
        children: [
          { element: <PageFour />, index: true },
          { path: 'five', element: <PageSix /> },
          { path: 'six', element: <PageSix /> },

        ],
      },
    ],
  },
];
