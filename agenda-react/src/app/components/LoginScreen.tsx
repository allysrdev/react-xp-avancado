import { Box, Button, Container, TextField } from '@mui/material';
import React, { useState } from 'react';
import { signInEndpoint, type IUser } from '../backend';

interface ILoginProps {
  onSignIn: (user: IUser) => void;
}

function LoginScreen({ onSignIn }: ILoginProps) {
  const [email, setEmail] = useState('allyson@email.com');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');

  function signIn(e: React.FormEvent) {
    e.preventDefault();
    signInEndpoint(email, password).then(
      (user) => {
        onSignIn(user);
      },
      (e) => {
        setError('E-mail não encontrado ou senha incorreta.');
        console.error(e);
      },
    );
  }

  return (
    <Container className="p-20">
      <h1>Agenda React</h1>
      <p>
        Para testar, utilize o e-mail <kbd>allyson@email.com</kbd> e senha <kbd>1234</kbd>{' '}
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            name="password"
            type="password"
            autoFocus
            margin="normal"
            label="Senha"
            fullWidth
            variant="standard"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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

export default LoginScreen;
