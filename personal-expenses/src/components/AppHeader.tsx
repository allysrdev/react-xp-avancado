import { Button } from '@mui/material';
import useAuth from '../hooks/useAuth';

function AppHeader() {
  const { user, logout } = useAuth();
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl">Personal Expenses</h2>

      <div className="flex gap-10">
        <strong>Olá, {user?.nome} </strong>
        <Button variant="contained" onClick={logout}>
          Sair
        </Button>
      </div>
    </div>
  );
}

export default AppHeader;
