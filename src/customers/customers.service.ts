import { Inject, Injectable } from '@nestjs/common';
import { Customer } from 'src/database/models';

@Injectable()
export class CustomersService {
  constructor(
    @Inject('CUSTOMER_REPOSITORY')
    private customerRepository: typeof Customer,
  ) {}

  async getCustomers() {
    try {
      return await this.customerRepository.findAll({
        attributes: ['id', 'name', 'email', 'phone', 'address'],
      });
    } catch (error) {
      console.log('-----> getCustomers ~ error:', error);
      throw new Error('Something went wrong');
    }
  }
}
