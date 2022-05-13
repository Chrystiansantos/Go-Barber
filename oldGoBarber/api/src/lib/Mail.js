import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    /* Maneira como o nodemailer chama uma conexao com um serviço externo  para evio de email
    e dentro dele preciso informar as configurações do config/mail.js */
    const { host, port, secure, auth } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      /* Aqui irei verificar se possui um auth, caso nao tenha irei passar null,
      porque há algumas estrategias de envio de email que ele nao necessita de autenticaçao */
      auth: auth.user ? auth : null,
    });
    this.configureTemplates();
  }

  // aqui estara a configuração do style do template
  configureTemplates() {
    // aqui irei definir o caminho de onde estao meus templates
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    // irei adicionar uma configuração ao tranporter
    // compile sera a maneira que ele ira compilar a msg
    this.transporter.use(
      'compile',
      /* nodemailerhbs, vem do nodemailer-handeblerhbs que importei */
      nodemailerhbs({
        viewEngine: exphbs.create({
          // aqui irei passar o caminho da pasta layouts
          layoutsDir: resolve(viewPath, 'layout'),
          // aqui irei passar o caminho da pasta partials
          partialsDir: resolve(viewPath, 'partials'),
          // aqui irei informar o layout
          defaultLayout: 'default',
          // aqui sera a extensao do arquivo
          extname: '.hbs',
        }),
        // aqui irei passar o viewPath que criei logo acima
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    // this.transporter.sendMail que sera responsavel por enviar o email
    return this.transporter.sendMail({
      /* aqui irei pegar os dados do mailConfig.default se comar com a message que
      recebo por parametro */
      ...mailConfig.default,
      ...message,
    });
  }
}
export default new Mail();
