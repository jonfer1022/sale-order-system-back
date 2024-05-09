import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import * as models from '../../src/database/models';
import {
  SalesOrder,
  Customer,
  Products,
  User,
} from '../../src/database/models';
import { StatusOrder } from '../../src/common/utils/enums';
dotenv.config();

async function main() {
  try {
    const amountSalesOrders = 100;
    const salesOrders: Array<Partial<SalesOrder>> = [];
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

    const customers = await Customer.findAll();
    const products = await Products.findAll();
    const users = await User.findAll();

    const statusOrder = Object.values(StatusOrder);

    for (let i = 0; i < amountSalesOrders; i++) {
      const randomBoolean = Math.random() < 0.5;
      const randomStatus = Math.floor(Math.random() * statusOrder.length);
      const randomCustomer = Math.floor(
        Math.random() * (customers.length - 1) + 1,
      );
      const randomProduct = Math.floor(
        Math.random() * (products.length - 1) + 1,
      );

      const partialStringProduct = products[randomProduct].id.slice(
        products[randomProduct].id.length - 4,
        products[randomProduct].id.length,
      );

      const quantity = Math.floor(Math.random() * (10 - 1) + 1);
      const totalPrice = products[randomProduct].price * quantity;

      salesOrders.push({
        customerId: customers[randomCustomer].id,
        productId: products[randomProduct].id,
        status: statusOrder[randomStatus] || StatusOrder.INVOICED,
        quantity: quantity,
        totalPrice: totalPrice,
        shippedDate:
          statusOrder[randomStatus] === StatusOrder.SHIPPED ? new Date() : null,
        rejectedDate:
          statusOrder[randomStatus] === StatusOrder.REJECTED
            ? new Date()
            : null,
        order: `SO-${new Date().getTime()}-${partialStringProduct}`,
        registeredBy: randomBoolean ? users[0].id : null,
      });
    }

    return Promise.all(
      salesOrders.map((salesOrder) => {
        return SalesOrder.create(salesOrder);
      }),
    );
  } catch (error) {
    console.log('ERROR: ', error);
    process.exit(1);
  }
}

main();
