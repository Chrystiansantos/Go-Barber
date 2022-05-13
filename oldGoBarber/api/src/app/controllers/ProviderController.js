import User from '../models/User';
import File from '../models/File';

class ProviderControler {
  async index(req, res) {
    const providers = await User.findAll({
      where: {
        provider: true,
      },
      // atributes fara com que eu retorne apenas esses dados da tabela
      attributes: ['id', 'name', 'email', 'avatar_id'],
      /* este comando fara eu retornar os dados de File daquele respectivo usuario */
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    res.json(providers);
  }
}

export default new ProviderControler();
