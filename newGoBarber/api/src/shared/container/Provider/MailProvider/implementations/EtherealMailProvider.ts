import nodemailer, { Transporter } from 'nodemailer';
import IMailtemplateProvider from '@shared/container/Provider/MailTemplateProvider/models/IMailTemplateProvider';
import { inject, injectable } from 'tsyringe';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailtemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      // dentro de create transporte irei passar as congis que peguei no ethereal
      // transporter sera responsavel pelas configuracoes de envio
      const transporter = nodemailer.createTransport({
        // host de envio
        host: account.smtp.host,
        // porta de envio
        port: account.smtp.port,
        // se tera securitizacao
        secure: account.smtp.secure,
        //
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      this.client = transporter;
    });
  }

  async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
    console.log('Message sent: %s', message.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
