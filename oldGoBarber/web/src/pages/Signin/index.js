import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import logo from '~/assets/logo.svg';
// import { Container } from './styles';
const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-email obrigatorio')
    .required('O e-mail é obrigatorio'),
  password: Yup.string().required('A senha é obrigatoria'),
});

export default function Signin() {
  function handleSUbmit(data) {
    console.log(data);
  }

  return (
    <>
      <img src={logo} alt="GoBarber" />
      <Form schema={schema} onSubmit={handleSUbmit}>
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input
          name="password"
          type="password"
          placeholder="Sua senha secreta"
        />
        <button type="submit"> Acessar</button>
        <Link to="/register">Criar conta gratuita</Link>
      </Form>
    </>
  );
}
