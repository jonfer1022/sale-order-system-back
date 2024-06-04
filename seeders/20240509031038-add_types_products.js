/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const uuid = require('uuid');
const table = 'TypeProducts';

const seed = [
  {
    id: uuid.v4(),
    name: 'Shirt',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    name: 'Pants',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    name: 'Shoes',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    name: 'Jacket',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    name: 'Socks',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log('-----> ~ up ~ seed', seed, table);
      return queryInterface.bulkInsert(
        { tableName: table, schema: 'public' },
        seed,
        {},
      );
    } catch (error) {
      console.log('ERROR: ', error);
    }
  },
};
