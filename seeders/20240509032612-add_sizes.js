/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const uuid = require('uuid');
const table = 'Sizes';

const seed = [
  {
    id: uuid.v4(),
    value: 'S',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    value: 'M',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    value: 'L',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    value: 'XL',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    value: 'XS',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    value: '5',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    value: '6',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    value: '7',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    value: '8',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    value: '9',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    value: '10',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    value: '11',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid.v4(),
    value: '12',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log('-----> ~ up ~ seed', seed, table);
      return queryInterface.bulkInsert(table, seed, {});
    } catch (error) {
      console.log('ERROR: ', error);
    }
  },
};
