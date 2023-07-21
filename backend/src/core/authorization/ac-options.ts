//* FULL_ACCESS will be handled visually by the frontend
export type PermissionAction = 'PAGE' | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'ACTIVATE' | 'DEACTIVATE'

export type PermissionObjectType =
    'ONBOARDING' |
    'TENANTS' |
    'PORTAL_DASHBOARD' |
    'USERS' |
    'ROLES' |
    'CONFIGURATION' |
    'RESET_USER_PASSWORD' |
    'ACTIVATE_USER' |
    'DEACTIVATE_USER' |
    'TEST_EMAIL'
    ;