import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { provider_id, date } = req.body;
    /* Verificar se o provider_id refere-se a um provedor de serviço */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers ' });
    }
    /* Ira verificar se o id e de um prestador de servico */
    const isProviderAppointment = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (isProviderAppointment) {
      return res.status(401).json({
        error: 'Providers, dont can have appointment ',
      });
    }

    const hourStart = startOfHour(parseISO(date));
    /* Irá verificar se a hoursStart e menor que a  data atual */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }
    /* Irei verificar se o prestado de serviço ja possui um agendamento no mesmo horario */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    /* Irá verificar se ja existe um agendamento neste horario */
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /* irei buscar o nome do usuario */
    const user = await User.findByPk(req.userId);
    /* Irei salvar uma notificação no mongoDB */

    /* format(hora a ser formatada, 'modo como a hora sera formatada'); */
    const formattedDate = format(
      hourStart,
      // dd representa o dia
      // MMMM nome do mes por extenso
      // H:mm hora do agendamento
      "'dia' dd 'de' MMMM', às 'H:mm'h'",
      { locale: pt }
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name}, para o ${formattedDate}`,
      user: provider_id,
    });
    return res.json(appointment);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: {
            model: File,
            as: 'avatar',
            /* preciso retornar o id sempre, e preciso do path, se nao nao irei saber
            o usuario qual o path da url */
            attributes: ['id', 'path', 'url'],
          },
        },
      ],
    });
    /* Notificar o prestador de serviço */
    return res.json(appointments);
  }

  async delete(req, res) {
    const appoitment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });
    // verifico se o id do usuario, e diferente do user_id do agendamento
    if (appoitment.user_id !== req.userId) {
      return res.status(401).json({
        error: 'You dont have permission to cancel this appointment',
      });
    }
    /* subHours => subtrai uma quantidade de horas de uma respectiva data  */
    // aqui removo 2 horas do horario do agendamento
    const dateWithSub = subHours(appoitment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json({ error: 'You can only cancel appoints 2 hours in advace' });
    }
    appoitment.canceled_at = new Date();
    await appoitment.save();
    /* await Queue.add(key que declarei dentro de cancellationMail, {
      dados a serem passado pro template
    }) */
    await Queue.add(CancellationMail.key, {
      appoitment,
    });

    return res.json(appoitment);
  }
}
export default new AppointmentController();
