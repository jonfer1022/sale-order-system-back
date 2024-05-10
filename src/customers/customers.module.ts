import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { ConfigService } from '@nestjs/config';
import { customerProvider } from 'src/database/providers/models.provider';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, ConfigService, ...customerProvider],
})
export class CustomersModule {}
