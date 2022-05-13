import React from 'react';
import {
  RouteProps as ReactDOMRouteProps,
  Route as ReactDOMRoute,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/AuthContext';

interface RoutePropsComponent extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

/*
  rotaAutenticada/usuarioAutenticado = true
  rotaAutenticada/usuarioNaoAutenticado = redireciona
  rotaNaoAutenticada/USuario/UsuarioAUtenticado = redireciona para o dashboard
  rotaNaoAutenticada/usuarioNaoAutenticado = true
*/

const Route: React.FC<RoutePropsComponent> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
