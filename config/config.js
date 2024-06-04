// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
dotenv.config();

const db = {
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: '0.0.0.0' || process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 5432,
  dialect: 'postgres',
  seederStorage: 'sequelize',
  seederStorageTableName: 'SequelizeSeeders',
  define: {
    schema: 'public',
  },
};

console.log('-----> ~ process.env:', db);

module.exports = {
  development: {
    ...db,
  },
};
