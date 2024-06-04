import { Sequelize } from 'sequelize-typescript';
import { environments } from '../common/utils/enviroments';
import * as models from './models';

const initDb = async () => {
  const env = environments();
  try {
    console.log('-----> ~ useFactory: ~ env.database:', env.database);
    const sequelize = new Sequelize({
      dialect: 'postgres',
      ...env.database,
      define: { schema: 'public' },
    });
    sequelize.addModels(Object.values(models));
    await sequelize.sync();
    console.log('Db connection established');
    return sequelize;
  } catch (error) {
    console.log('-----> ~ useFactory: ~ error:', error);
  }
};

initDb();
