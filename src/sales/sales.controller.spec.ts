import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { NewSaleDto, SalesDto, UpdateSaleDto } from './dto/sales.dto';
import { RequestAuth } from '../auth/types/request.type';
import { SalesOrder } from '../database/models';
import { StatusOrder } from '../common/utils/enums';

describe('SalesController', () => {
  let controller: SalesController;
  let service: SalesService;

  beforeEach(async () => {
    const serviceMock = {
      getSales: jest.fn(),
      getSalesById: jest.fn(),
      updateSaleById: jest.fn(),
      deleteSaleById: jest.fn(),
      createSale: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [{ provide: SalesService, useValue: serviceMock }],
    }).compile();

    controller = module.get<SalesController>(SalesController);
    service = module.get<SalesService>(SalesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get sales', async () => {
    const params: SalesDto = {
      limit: '10',
      page: '1',
      status: StatusOrder.SHIPPED,
      userId: '1',
      orderIn: 'asc',
    };
    const result = {
      rows: [
        { id: '1', status: 'active' } as unknown as SalesOrder,
        { id: '2', status: 'inactive' } as unknown as SalesOrder,
      ],
      count: 2,
    };
    jest.spyOn(service, 'getSales').mockResolvedValue(result);

    expect(await controller.getSales(params)).toBe(result);
    expect(service.getSales).toHaveBeenCalledWith({
      limit: Number(params.limit),
      page: Number(params.page),
      status: params.status,
      userId: params.userId,
      orderIn: params.orderIn,
    });
  });

  it('should get sale by id', async () => {
    const id = '1';
    const result = { id, status: 'active' } as unknown as SalesOrder;
    jest.spyOn(service, 'getSalesById').mockResolvedValue(result);

    expect(await controller.getSalesById(id)).toBe(result);
    expect(service.getSalesById).toHaveBeenCalledWith(id);
  });

  it('should update sale by id', async () => {
    const id = '1';
    const body: UpdateSaleDto = {
      status: StatusOrder.SHIPPED,
      registeredBy: '1',
    };
    const result: [affectedCount: number] = [1];
    jest.spyOn(service, 'updateSaleById').mockResolvedValue(result);

    expect(await controller.updateSaleById(id, body)).toBe(result);
    expect(service.updateSaleById).toHaveBeenCalledWith(id, body);
  });

  it('should delete sale by id', async () => {
    const id = '1';
    const result = 1;
    jest.spyOn(service, 'deleteSaleById').mockResolvedValue(result);

    expect(await controller.deleteSaleById(id)).toBe(result);
    expect(service.deleteSaleById).toHaveBeenCalledWith(id);
  });

  it('should create a sale', async () => {
    const body: NewSaleDto = {
      customerId: '1',
      productId: '1',
      quantity: '10',
      status: StatusOrder.INVOICED,
      isRegistered: true,
    };
    const req: RequestAuth = { user: { id: '1' } } as any;
    const result = {
      id: '1',
      itemId: '1',
      quantity: 10,
      registeredBy: '1',
    } as unknown as SalesOrder;
    jest.spyOn(service, 'createSale').mockResolvedValue(result);

    expect(await controller.createSale(body, req)).toBe(result);
    expect(service.createSale).toHaveBeenCalledWith({
      ...body,
      quantity: Number(body.quantity),
      registeredBy: req.user.id,
    });
  });
});
