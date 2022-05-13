import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';
// models
import User from '../app/models/User';
import File from '../app/models/File';
import Appointments from '../app/models/Appointment';

const models = [User, File, Appointments];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  // este metodo ficara responsavel por fazer a conexão e carregar os models
  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      /* model.associate && model.associate(this.coonection), este metodo sera responsavel por associar
      os model que possui relacionamento caso exista por isso preciso do && ele verifica se existe o
      metodo associate dentro do model caso exista ele passa o this.connection para dentro do metodo
    */
      // this.conection.models sera todos os models da minha aplicação
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    /* Aqui irei passar a url de conexão do mongo */
    this.mongoConnection = mongoose.connect(
      /* nomedobanco/localDoBanco/porta/nomeDaBaseDeDados */
      process.env.MONGO_URL,
      /* useNewUrlPaser: preciso utilizar pois estou usando este formato de url novo */
      /* useFindAndModify uma maneira de como iremos utilizar o mongo quando estivermos
      buscando registros */
      { useNewUrlParser: true, useFindAndModify: true }
    );
  }
}

export default new Database();
