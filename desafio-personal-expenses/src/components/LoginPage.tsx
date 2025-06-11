import { Box, Button, Container, TextField } from '@mui/material';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { createSessionEndpoint } from '../backend';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { user, setUser } = useAuth();
  const [error, setError] = useState('');
  const navigator = useNavigate();

  async function signIn(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await createSessionEndpoint(user!.email, user!.senha || '');

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setUser(data);
        navigator('/2025-01', { replace: true });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error(err);
      setError('Erro de rede ou servidor');
    }
  }

  return (
    <Container className="p-20 flex flex-col  justify-center gap-10">
      <h1>Personal Expenses</h1>
      <p>
        Para testar, utilize o e-mail <kbd>usuario@email.com </kbd> e senha <kbd>1234</kbd>{' '}
      </p>

      <form onSubmit={(e) => signIn(e)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'end',
          }}
        >
          <TextField
            name="email"
            autoFocus
            margin="normal"
            label="E-mail"
            fullWidth
            variant="standard"
            value={user?.email || ''}
            onChange={(event) => setUser({ ...user!, email: event.target.value })}
          />
          <TextField
            name="password"
            type="password"
            autoFocus
            margin="normal"
            label="Senha"
            fullWidth
            variant="standard"
            value={user?.senha || ''}
            onChange={(event) => setUser({ ...user!, senha: event.target.value })}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button type="submit" variant="contained" color="primary">
            Entrar
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default LoginPage;
