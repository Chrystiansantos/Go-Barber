import React from 'react';
import { render, fireEvent, wait, waitFor } from '@testing-library/react';

import SignIn from '../../pages/signin';

// jest.fn() consiste em uma funcao vazia que nao tem funcionalidade alguma
const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();
// Aqui eu crio uma funcao que seja uma dependencia externa do meu componente
// jest.mock('nome do pacote que sera chamado', oque eu desejo retornar quando ele for chamado
jest.mock('react-router-dom', () => {
  return {
    // consigo criar uma funcao fazian dentro de uma outra funcao vazia, e retornala
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    // aqui eu chamo uma funcao que ira receber parametros no children e ira retornar o mesmo
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/AuthContext.tsx', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/ToastContext.tsx', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able sign', async () => {
    // aqui irei conseguir pegar os elementos denro do meu html, para manipula-lo
    // irei pegar todos os elementos com base no placeholder e pelo text no button
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    // aqui eu pego as referencias dos inputs
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    // aqui irei preencher os valores dentro do input, utilizo esse fireEvent para simular os eventos do usuario
    fireEvent.change(emailField, { target: { value: 'chrystian@gmail.com' } });
    fireEvent.change(passwordField, { target: { value: '123123' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      // espero que a funcao hisory.push tenha sido chamada com o parametro '/dashboard'
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '123123' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an error if login fails', async () => {
    // aqui irei reescrever a funcao mockedSignIn que defini logo acima
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'chrystian@gmail.com' } });
    fireEvent.change(passwordField, { target: { value: '123123' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
