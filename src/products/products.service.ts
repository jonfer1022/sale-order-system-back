import { Inject, Injectable } from '@nestjs/common';
import { Products, Sizes, TypeProducts } from 'src/database/models';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_REPOSITORY')
    private productsRepository: typeof Products,
  ) {}

  async getProducts() {
    try {
      return await this.productsRepository.findAll({
        attributes: ['id', 'name', 'description', 'price', 'stock', 'color'],
        include: [
          {
            model: TypeProducts,
            attributes: ['id', 'name'],
          },
          {
            model: Sizes,
            attributes: ['id', 'value'],
          },
        ],
      });
    } catch (error) {
      console.log('-----> getProducts ~ error:', error);
      throw new Error('Something went wrong');
    }
  }
}
