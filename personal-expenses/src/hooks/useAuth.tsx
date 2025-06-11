import { createContext, useContext, useEffect, useState } from 'react';
import { endSessionEdnpoint, getUserEndpoint } from '../backend';
import { useNavigate } from 'react-router-dom';

export interface IUser {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
}

interface IAuthContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  setUser: () => {},
  loading: true,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigate();

  function logout() {
    setLoading(true);
    endSessionEdnpoint()
      .then(() => {
        setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => {
        setLoading(false);
        navigator('/', { replace: true });
      });
  }

  useEffect(() => {
    console.log('AuthProvider: useEffect iniciado');
    getUserEndpoint()
      .then((responseUser) => {
        if (responseUser && responseUser.id) {
          setUser(responseUser);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default function useAuth() {
  return useContext(AuthContext);
}
