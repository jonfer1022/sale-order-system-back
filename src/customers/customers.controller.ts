import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCustomers() {
    return await this.customersService.getCustomers();
  }
}
