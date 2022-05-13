import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
// import { Container } from './styles';
import logo from '~/assets/logo.svg';

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatorio'),
  email: Yup.string()
    .email('Insira um e-email válido !')
    .required('O e-email é obrigatório'),
  password: Yup.string()
    .min(6, 'No minimo 6 caracters')
    .required('A senha é obrigatoria'),
});

export default function SignUp() {
  function handleSubmit(data) {
    console.log(data);
  }
  return (
    <>
      <img src={logo} alt="GoBarber" />
      <Form schema={schema} onSubmit={handleSubmit}>
        <Input name="name" type="text" placeholder="Nome completo" />
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input
          name="password"
          type="password"
          placeholder="Sua senha secreta"
        />
        <button type="submit">Criar conta</button>
        <Link to="/">Já tenho login</Link>
      </Form>
    </>
  );
}
