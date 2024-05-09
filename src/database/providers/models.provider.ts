import { SalesOrder, User } from '../models';

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
