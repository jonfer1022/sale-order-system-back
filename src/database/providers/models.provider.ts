import { Customer, SalesOrder, User, Products } from '../models';

export const userProvider = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];

export const salesProvider = [
  {
    provide: 'SALES_REPOSITORY',
    useValue: SalesOrder,
  },
];

export const customerProvider = [
  {
    provide: 'CUSTOMER_REPOSITORY',
    useValue: Customer,
  },
];

export const productsProvider = [
  {
    provide: 'PRODUCTS_REPOSITORY',
    useValue: Products,
  },
];
