import { USER_TYPE } from "./users";

export type ActionMap<M extends { [ index: string ]: any }> = {
    [ Key in keyof M ]: M[ Key ] extends undefined
    ? {
        type: Key;
    }
    : {
        type: Key;
        payload: M[ Key ];
    };
};

export type OnboardingRequest = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
    address: string;
}

export type LoginInput = {
    userId: string;
    password: string;
    tenantId: string;
    domain: USER_TYPE
}

// export type UserPermission = Record<string, any>;

export type AuthenticatedUser = {
    userId: string;
    email: string;
    picture: string;
    tenantId: string;
    tenantSlug: string;
    tenantLogo: string;
    screenName: string;
    roles: string[];
    userType: USER_TYPE;
};


export type AuthState = {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: AuthenticatedUser | null;
    permissions: string[];
};

export type JWTContextType = AuthState & {
    loading: boolean;
    login: (input: LoginInput) => Promise<void>;
    logout: () => Promise<void>;
    request: (input: OnboardingRequest) => Promise<any>;
    resetPassword: (email: string) => Promise<void>;
};
