import { Sequelize } from 'sequelize-typescript';
import { environments } from 'src/common/utils/enviroments';
import * as models from './models';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const env = environments();
      const sequelize = new Sequelize({
        dialect: 'postgres',
        ...env.database,
      });
      try {
        sequelize.addModels(Object.values(models));
        await sequelize.sync();
        console.log('Db connection established');
        return sequelize;
      } catch (error) {
        console.log('-----> ~ useFactory: ~ error:', error);
      }
    },
  },
];
