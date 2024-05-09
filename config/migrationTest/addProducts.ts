import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import * as models from '../../src/database/models';
import { TypeProducts, Sizes, Products } from '../../src/database/models';
import { Colors } from '../../src/common/utils/enums';
dotenv.config();

async function main() {
  try {
    const amountProducts = 100;
    const products: Array<Partial<Products>> = [];
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

    const typeProducts = await TypeProducts.findAll();
    const sizes = await Sizes.findAll();
    const colors = Object.values(Colors);

    for (let i = 0; i < amountProducts; i++) {
      const randomType = Math.floor(
        Math.random() * (typeProducts.length - 1) + 1,
      );
      const randomSize = Math.floor(Math.random() * (sizes.length - 1) + 1);
      const randomColor = Math.floor(Math.random() * (colors.length - 1) + 1);

      const typeProduct = typeProducts[randomType];
      let size = sizes[randomSize];
      const sizeDefaultShoes = sizes.filter((s) => s.value === '8');
      const sizeDefaultClothes = sizes.filter((s) => s.value === 'L');
      if (
        typeProduct.name === 'Shoes' &&
        ['S', 'M', 'L', 'XL', 'XS'].includes(size.value)
      ) {
        size = sizeDefaultShoes[0];
      }

      if (
        typeProduct.name !== 'Shoes' &&
        ['5', '6', '7', '8', '9', '10', '11', '12'].includes(size.value)
      ) {
        size = sizeDefaultClothes[0];
      }
      products.push({
        name: `${typeProduct.name} ${i}${new Date().getMilliseconds()}`,
        description: `Description - ${typeProduct.name} ${i}${new Date().getMilliseconds()}`,
        price: Math.floor(Math.random() * 1000),
        stock: Math.floor(Math.random() * 100),
        color: colors[randomColor],
        typeId: typeProduct.id,
        sizeId: size.id,
      });
    }

    return Promise.all(
      products.map(async (product) => {
        await Products.create(product);
      }),
    );
  } catch (error) {
    console.log('ERROR: ', error);
    process.exit(1);
  }
}

main();
