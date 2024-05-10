import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts() {
    return await this.productsService.getProducts();
  }
}
