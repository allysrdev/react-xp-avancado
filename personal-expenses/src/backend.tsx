import type { IUser } from './hooks/useAuth';

export function createSessionEndpoint(email: string, senha: string) {
  return fetch('http://localhost:3001/sessao/criar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      senha,
    }),
    credentials: 'include',
  }).catch((error) => {
    return error.message;
  });
}

export async function endSessionEdnpoint() {
  return await fetch('http://localhost:3001/sessao/finalizar', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    return error.message;
  });
}

export function getUserEndpoint(): Promise<IUser> {
  return fetch('http://localhost:3001/sessao/usuario', {
    method: 'GET',
    credentials: 'include',
  })
    .then((res) => res.json())
    .catch((error) => {
      return error.message;
    });
}
