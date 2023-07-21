import { createContext, ReactNode, useCallback, useMemo, useReducer } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { SplashScreen } from 'src/components/loading-screen';
import { setSession, clearSession, getAccessToken, isValidToken } from 'src/utils/jwt';
import { getErrorFromGQL, consoleError } from 'src/utils/errors';

import { ActionMap, AuthState, AuthenticatedUser, JWTContextType, OnboardingRequest, LoginInput } from 'src/types/authentication';
import { USER_TYPE } from 'src/types/users';

import { SIGN_IN, SIGN_OUT, CREATE_ONBOARD_REQUEST } from './graphql/mutations';
import { SESSION } from './graphql/queries';

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Request = 'REQUEST',
}

type JWTAuthPayload = {
  [ Types.Initial ]: {
    isAuthenticated: boolean;
    user: AuthenticatedUser | null;
    permissions: [];
  };
  [ Types.Login ]: {
    user: AuthenticatedUser;
    permissions: [];
  };
  [ Types.Logout ]: undefined;
  [ Types.Request ]: undefined;
};

export type JWTActions = ActionMap<JWTAuthPayload>[ keyof ActionMap<JWTAuthPayload> ];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  permissions: []
};

const JWTReducer = (state: AuthState, action: JWTActions) => {

  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
        permissions: action.payload.permissions
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        permissions: action.payload.permissions
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        permissions: [],
      };

    case 'REQUEST':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        permissions: [],
      };
    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {

  const [ state, dispatch ] = useReducer(JWTReducer, initialState);

  const [ signIn ] = useMutation(SIGN_IN);
  const [ signOut ] = useMutation(SIGN_OUT);
  const [ onboardRequest ] = useMutation(CREATE_ONBOARD_REQUEST);

  const generateAuthenticatedUser = (response: any): AuthenticatedUser | null => {

    if (!response)
      return null;

    const { session } = response;

    if (!session)
      return null;

    const authUser: AuthenticatedUser = {
      userId: session.userId || '',
      tenantId: session.tenantId || '',
      tenantLogo: session.tenantLogo || '',
      tenantSlug: session.tenantSlug || '',
      roles: session.roles || [],
      email: session.email || '',
      picture: session.picture || '',
      screenName: session.screenName || session.email || '',
      userType: session.userType || USER_TYPE.COMPANY_USER,
    };

    return authUser;
  }

  const { loading } = useQuery(SESSION, {
    fetchPolicy: 'cache-first',
    onError: (error: any) => {
      consoleError(error);
      dispatch({
        type: Types.Initial,
        payload: {
          isAuthenticated: false,
          user: null,
          permissions: [],
        }
      });
    },
    onCompleted: (data) => {
      try {

        const accessToken = getAccessToken();

        if (!isValidToken(accessToken) || !data?.info?.session || !data.info?.permissions) {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
              permissions: [],
            }
          });
        }

        const { permissions } = data.info || {};
        const authUser = generateAuthenticatedUser(data.info);

        if (authUser) {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user: authUser,
              permissions: permissions?.actions || []
            }
          });
        }

      }
      catch (err) {
        consoleError(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
            permissions: []
          }
        });
      }
    }
  });


  const login = useCallback(async (input: LoginInput) => {
    try {
      const response = await signIn({ variables: { input } });

      const token = String(response?.data?.signIn?.session?.accessToken || '');
      if (!token)
        return;

      const { permissions } = response?.data?.signIn || {};
      const authUser = generateAuthenticatedUser(response?.data?.signIn);
      if (!authUser)
        return;

      setSession(token);
      dispatch({
        type: Types.Login,
        payload: {
          user: authUser,
          permissions
        }
      });

    }
    catch (error) {
      consoleError(error);
      const msg = getErrorFromGQL(error);
      throw new Error(msg);
    }
  }, [ signIn ]);

  const onboard = useCallback(async (input: OnboardingRequest) => {
    try {

      const response = await onboardRequest({ variables: { input } });
      dispatch({ type: Types.Request });
      return response.data?.result;
    }
    catch (error) {
      const msg = getErrorFromGQL(error);
      throw new Error(msg);
    }
  }, [ onboardRequest ]);

  const logout = useCallback(async () => {
    try {
      await signOut();
      clearSession();
      dispatch({ type: Types.Logout });
    }
    catch (error) {
      consoleError(error);
      const msg = getErrorFromGQL(error);
      throw new Error(msg);
    }
  }, [ signOut ]);

  const resetPassword = useCallback(async (email: string) => { }, []);


  const memoizedValue = useMemo(
    () => ({
      ...state,
      loading,
      login,
      logout,
      request: onboard,
      resetPassword,
    }),
    [ state, loading, login, logout, onboard, resetPassword ]
  );


  return (<AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>);
}

function AuthConsumer({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Consumer>
      {(auth) => (auth?.loading ? <SplashScreen /> : children)}
    </AuthContext.Consumer>
  );
}


export { AuthContext, AuthProvider, AuthConsumer };

