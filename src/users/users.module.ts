import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigService } from '@nestjs/config';
import { userProvider } from 'src/database/providers/models.provider';

@Module({
  providers: [UsersService, ConfigService, ...userProvider],
  controllers: [UsersController],
})
export class UsersModule {}
