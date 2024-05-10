import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    return await this.usersService.getUsers();
  }
}
