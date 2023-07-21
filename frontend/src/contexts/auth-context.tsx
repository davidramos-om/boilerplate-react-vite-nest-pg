import { createContext } from 'react';

import { JWTContextType } from 'src/types/authentication';

export const AuthContext = createContext({} as JWTContextType);
