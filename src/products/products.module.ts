import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ConfigService } from '@nestjs/config';
import { productsProvider } from 'src/database/providers/models.provider';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ConfigService, ...productsProvider],
})
export class ProductsModule {}
