import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  // este sequelize sera a conexao
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        // Virtual e um campo que ira existir apenas na aplicação
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        // este sequelize recebo como parametro no metodo init, sera responsavel pela conexao
        sequelize,
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  // este metodo associate ele ira receber todos os models da aplicação atraves do index
  static associate(models) {
    /* this.belongsTo(aqui vou informar o nome do model que ira relacionar com user,{
      foreignKey: 'nome da coluna na tabela de User que se relacionara com a tabela de FIles'
    }); */
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
