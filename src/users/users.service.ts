import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/database/models';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
  ) {}

  async getUsers() {
    try {
      return await this.userRepository.findAll({
        attributes: ['id', 'name', 'email'],
      });
    } catch (error) {
      console.log('-----> getUsers ~ error:', error);
      throw new Error('Something went wrong');
    }
  }
}
