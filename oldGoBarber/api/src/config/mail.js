export default {
  // endereco
  host: process.env.MAIL_HOST,
  // porta
  port: process.env.MAIL_PORT,
  // se e seguro ou nao
  secure: false,
  // usuario e senha, autenticação como se fosse para enviar um email
  auth: {
    user: process.env.MAIL_HOST,
    pass: process.env.MAIL_PASS,
  },
  /* aqui abaixo sera definido algumas configuraçoes padrao que sera utilizada
   para todo envio de email */
  default: {
    /* Remetente padrao dos emails */
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  },
};
