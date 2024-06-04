import * as dotenv from 'dotenv';
dotenv.config();

export const environments = () => ({
  port: parseInt(process.env.PORT) || 3000,
  database: {
    host: process.env.DATABASE_HOST_DOCKER || process.env.DATABASE_HOST_LOCAL,
    port:
      parseInt(process.env.DATABASE_PORT_DOCKER) ||
      parseInt(process.env.DATABASE_PORT_LOCAL) ||
      5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
});
