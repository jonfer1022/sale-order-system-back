import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Products, Sizes, TypeProducts } from '../database/models';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: typeof Products;

  beforeEach(async () => {
    productsRepository = {
      findAll: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: 'PRODUCTS_REPOSITORY',
          useValue: productsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return all products with their related type and sizes', async () => {
      const productsMock = [
        {
          id: '1',
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
          stock: 10,
          color: 'Red',
          TypeProduct: { id: '1', name: 'Type 1' },
          Sizes: [{ id: '1', value: 'S' }],
        },
      ] as unknown as Products[];
      jest
        .spyOn(service['productsRepository'], 'findAll')
        .mockResolvedValue(productsMock);

      const result = await service.getProducts();

      expect(result).toEqual(productsMock);
      expect(service['productsRepository'].findAll).toHaveBeenCalledWith({
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
    });

    it('should throw an error if something goes wrong', async () => {
      const errorMessage = 'Something went wrong';
      jest
        .spyOn(service['productsRepository'], 'findAll')
        .mockRejectedValue(new Error(errorMessage));

      await expect(service.getProducts()).rejects.toThrow(errorMessage);
    });
  });
});
