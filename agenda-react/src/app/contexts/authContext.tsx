import React, { useContext } from 'react';
import type { IUser } from '../backend';

interface IAuthContext {
  user: IUser;
  signOut: () => void;
}

export const AuthContext = React.createContext<IAuthContext>({
  user: {
    name: '',
    email: '',
  },
  signOut: () => {},
});

export function useAuthContext() {
  return useContext(AuthContext);
}
