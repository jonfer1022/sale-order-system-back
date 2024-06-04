import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import {
  SalesOrder,
  Products,
  User,
  Customer,
  Sizes,
  TypeProducts,
} from '../database/models';
import { StatusOrder } from '../common/utils/enums';
import { GroupedCountResultItem, Model, Op } from 'sequelize';

describe('SalesService', () => {
  let service: SalesService;
  let salesRepository: typeof SalesOrder;
  let productsRepository: typeof Products;

  beforeEach(async () => {
    salesRepository = {
      findAndCountAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    } as any;

    productsRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: 'SALES_REPOSITORY',
          useValue: salesRepository,
        },
        {
          provide: 'PRODUCTS_REPOSITORY',
          useValue: productsRepository,
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSales', () => {
    it('should return sales with correct filtering and ordering', async () => {
      const salesMock = {
        rows: [
          { id: '1', status: 'active' } as unknown as SalesOrder,
          { id: '2', status: 'inactive' } as unknown as SalesOrder,
        ],
        count: 2 as unknown as GroupedCountResultItem[],
      };

      jest
        .spyOn(service['salesRepository'], 'findAndCountAll')
        .mockResolvedValue(salesMock);

      const result = await service.getSales({
        limit: 10,
        page: 1,
        status: StatusOrder.SHIPPED,
        orderIn: 'ASC',
      });

      expect(result).toEqual(salesMock);
      expect(service['salesRepository'].findAndCountAll).toHaveBeenCalledWith({
        where: { status: StatusOrder.SHIPPED, shippedDate: { [Op.not]: null } },
        order: [['shippedDate', 'ASC']],
        limit: 10,
        offset: 0,
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
    });
  });

  describe('getSalesById', () => {
    it('should return a sale by id', async () => {
      const saleMock: Model<any, any> = { id: '1', status: 'active' } as any;
      jest
        .spyOn(service['salesRepository'], 'findOne')
        .mockResolvedValue(saleMock);

      const result = await service.getSalesById('1');

      expect(result).toEqual(saleMock);
      expect(service['salesRepository'].findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        attributes: [
          'id',
          'order',
          'totalPrice',
          'shippedDate',
          'status',
          'quantity',
          'createdAt',
        ],
        include: [
          {
            model: Customer,
            attributes: ['id', 'name', 'email', 'phone', 'address'],
          },
          {
            model: Products,
            attributes: [
              'id',
              'name',
              'description',
              'price',
              'stock',
              'color',
            ],
            include: [
              { model: Sizes, attributes: ['id', 'value'] },
              { model: TypeProducts, attributes: ['id', 'name'] },
            ],
          },
          { model: User, attributes: ['id', 'name', 'email'] },
        ],
      });
    });
  });

  describe('updateSaleById', () => {
    it('should update a sale by id', async () => {
      const resultMock: [affectedCount: number] = [1];
      jest
        .spyOn(service['salesRepository'], 'update')
        .mockResolvedValue(resultMock);

      const result = await service.updateSaleById('1', {
        status: StatusOrder.REJECTED,
      });

      expect(result).toEqual(resultMock);
      expect(service['salesRepository'].update).toHaveBeenCalledWith(
        { status: StatusOrder.REJECTED },
        { where: { id: '1' } },
      );
    });
  });

  describe('deleteSaleById', () => {
    it('should delete a sale by id', async () => {
      const saleMock: Model<SalesOrder> = {
        id: '1',
        status: StatusOrder.INVOICED,
      } as any;
      jest
        .spyOn(service['salesRepository'], 'findOne')
        .mockResolvedValue(saleMock);
      jest.spyOn(service['salesRepository'], 'destroy').mockResolvedValue(1);

      const result = await service.deleteSaleById('1');

      expect(result).toEqual(1);
      expect(service['salesRepository'].destroy).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should not delete a shipped sale', async () => {
      const saleMock: Model<SalesOrder> = {
        id: '1',
        status: StatusOrder.SHIPPED,
      } as any;
      jest
        .spyOn(service['salesRepository'], 'findOne')
        .mockResolvedValue(saleMock);

      await expect(service.deleteSaleById('1')).rejects.toThrow(
        'Can not delete shipped sale',
      );
    });
  });

  describe('createSale', () => {
    it('should create a sale', async () => {
      const productMock = {
        id: '1',
        stock: 20,
        price: 100,
        color: 'red',
      } as Products;

      const saleMock = {
        id: '1',
        productId: '1',
        quantity: 10,
        totalPrice: 1000,
      };
      jest
        .spyOn(service['productsRepository'], 'findOne')
        .mockResolvedValue(productMock);
      jest
        .spyOn(service['salesRepository'], 'create')
        .mockResolvedValue(saleMock);
      jest
        .spyOn(service['productsRepository'], 'update')
        .mockResolvedValue([1]);

      const result = await service.createSale({ productId: '1', quantity: 10 });

      expect(result).toEqual(saleMock);
      expect(service['salesRepository'].create).toHaveBeenCalledWith({
        productId: '1',
        quantity: 10,
        totalPrice: 1000,
        shippedDate: null,
        rejectedDate: null,
        order: expect.stringContaining('SO-'),
      });
      expect(service['productsRepository'].update).toHaveBeenCalledWith(
        { ...productMock, stock: 10 },
        { where: { id: '1' } },
      );
    });

    it('should throw an error if not enough stock', async () => {
      const productMock = { id: '1', stock: 5, price: 100 } as Products;
      jest
        .spyOn(service['productsRepository'], 'findOne')
        .mockResolvedValue(productMock);

      await expect(
        service.createSale({ productId: '1', quantity: 10 }),
      ).rejects.toThrow('Not enough stock');
    });

    it('should throw an error if product is out of stock', async () => {
      const productMock = {
        id: '1',
        stock: 0,
        price: 100,
        quantity: 1,
      } as unknown as Products;
      jest
        .spyOn(service['productsRepository'], 'findOne')
        .mockResolvedValue(productMock);

      await expect(
        service.createSale({ productId: '1', quantity: 10 }),
      ).rejects.toThrow('Product out of stock');
    });
  });
});
