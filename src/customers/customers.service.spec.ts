import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { Customer } from 'src/database/models';

describe('CustomersService', () => {
  let service: CustomersService;
  let customersRepository: typeof Customer;

  beforeEach(async () => {
    customersRepository = {
      findAll: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: 'CUSTOMER_REPOSITORY',
          useValue: customersRepository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCustomers', () => {
    it('should return all customers with specified attributes', async () => {
      const customersMock = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123456789',
          address: '123 Street',
        },
      ] as unknown as Customer[];

      jest
        .spyOn(service['customerRepository'], 'findAll')
        .mockResolvedValue(customersMock);

      const result = await service.getCustomers();

      expect(result).toEqual(customersMock);
      expect(service['customerRepository'].findAll).toHaveBeenCalledWith({
        attributes: ['id', 'name', 'email', 'phone', 'address'],
      });
    });

    it('should throw an error if something goes wrong', async () => {
      const errorMessage = 'Something went wrong';
      jest
        .spyOn(service['customerRepository'], 'findAll')
        .mockRejectedValue(new Error(errorMessage));

      await expect(service.getCustomers()).rejects.toThrow(errorMessage);
    });
  });
});
