

const ROOTS = {
  AUTH: '/auth/guest',
  DASHBOARD: '/dashboard',
};


export const paths = {

  // AUTH
  auth: {
    portal: `${ROOTS.AUTH}/portal`,
    company: (slug: string) => slug ? `${ROOTS.AUTH}/company?code=${slug}` : `${ROOTS.AUTH}/company`, // param name can be : slug, code, name or id
    register: `${ROOTS.AUTH}/register`,
    resetpassword: (tenantId: string, token: string) => `${ROOTS.AUTH}/reset-password?tenant=${tenantId}&token=${token}`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    onboarding_requests: {
      root: `${ROOTS.DASHBOARD}/onboarding-requests`,
      view: (id: string) => `${ROOTS.DASHBOARD}/onboarding-requests/${id}/view`,
    },
    tenants: {
      root: `${ROOTS.DASHBOARD}/tenants`,
      new: `${ROOTS.DASHBOARD}/tenants/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tenants/${id}/edit`,
      completed: (slug: string) => `${ROOTS.DASHBOARD}/tenants/${slug}/completed`,
    },
    settings: {
      general: `${ROOTS.DASHBOARD}/settings`,
    },
    users: {
      root: `${ROOTS.DASHBOARD}/users`,
      new: `${ROOTS.DASHBOARD}/users/new`,
      profile: `${ROOTS.DASHBOARD}/users/profile`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/users/${id}/edit`,
    },
    roles: {
      root: `${ROOTS.DASHBOARD}/roles`,
      new: `${ROOTS.DASHBOARD}/roles/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/roles/${id}/edit`,
    },
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },
};
