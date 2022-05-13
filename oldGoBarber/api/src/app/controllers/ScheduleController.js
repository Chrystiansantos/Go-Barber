import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
  async index(req, res) {
    /* Verifico se o usuario e realmente um prestador de serviço */
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!checkUserProvider) {
      res.status(401).json({ error: 'User is not a provider' });
    }

    // aqui ele ira pegar a data pelo req.params
    const { date } = req.query;
    const parseDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          /* Preciso colocar dentro de colchetes */
          [Op.between]: [
            // o valor dese sera um arrai e aqui dentro irei informar os valores para ser comparado
            /* irei verificar se a hora do agendamento esta entre a hora starOfDay e endOfday,
            passando como parametro o dia que converti no tipo date */
            startOfDay(parseDate),
            endOfDay(parseDate),
          ],
        },
      },
      // irei ordenar por data
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
