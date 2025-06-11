import { Navigate } from 'react-router-dom';
import type { IUser } from '../hooks/useAuth';

interface ProtectedRouteProps {
  user: IUser | null;
  children: React.ReactNode;
  loading: boolean;
}

export function ProtectedRoute({ user, children, loading }: ProtectedRouteProps) {
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
