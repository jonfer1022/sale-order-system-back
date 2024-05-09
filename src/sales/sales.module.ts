import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { ConfigService } from '@nestjs/config';
import { salesProvider } from 'src/database/providers/models.provider';

@Module({
  controllers: [SalesController],
  providers: [SalesService, ConfigService, ...salesProvider],
})
export class SalesModule {}
