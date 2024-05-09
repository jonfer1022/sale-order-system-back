import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import * as models from '../../src/database/models';
import { Customer } from '../../src/database/models';
import { uniqueNamesGenerator, names } from 'unique-names-generator';
dotenv.config();

async function main() {
  try {
    const amountCustomers = 20;
    const customers: Array<Partial<Customer>> = [];
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });
    sequelize.addModels(Object.values(models));
    console.log('Db connection established');

    for (let i = 0; i < amountCustomers; i++) {
      const name: string = uniqueNamesGenerator({ dictionaries: [names] });
      const randomPhone = Math.floor(Math.random() * (90000 - 9999) + 9999);
      customers.push({
        name: `${name} ${i}`,
        email: name + i + '@customer.com',
        phone: `+52${randomPhone}`,
        address: `Address ${i} #${i}`,
      });
    }

    return Promise.all(
      customers.map(async (customer) => {
        await Customer.create(customer);
      }),
    );
  } catch (error) {
    console.log('ERROR: ', error);
    process.exit(1);
  }
}

main();
