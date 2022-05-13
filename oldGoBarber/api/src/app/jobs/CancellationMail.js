import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  /* este metodo ira retornar o key utilizando o get frente posso acessa-lo da seguinte forma
   import canMail from '../cancelation,,, | canMail.key */
  get key() {
    /* irei retornar uma chave unica, pois cada job necessita ter essa chave */
    return 'CancellationMail';
  }

  /* Sera a tarefa que sera executada quando o processo for executado, sera a partir daqui que
  enviarei meu email */
  /* irra receber os dados para compor o email */
  async handle({ data }) {
    const { appoitment } = data;
    await Mail.sendMail({
      to: `${appoitment.provider.name} <${appoitment.provider.email}>`,
      subject: 'Agendamento cancelado',
      // template que estou utilizando
      template: 'cancelation',
      // aqui preciso informar todas as variaveis que meu template esta esperando
      context: {
        provider: appoitment.provider.name,
        user: appoitment.user.name,
        date: format(
          parseISO(appoitment.date),
          "'dia' dd 'de' MMMM', às ' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
