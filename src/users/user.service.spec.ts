import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from 'src/database/models';

describe('UsersService', () => {
  let service: UsersService;
  let userRepositoryMock: typeof User;

  beforeEach(async () => {
    userRepositoryMock = {
      findAll: jest.fn().mockResolvedValue([
        { id: 1, name: 'Jonathan', email: 'jonathan@example.com' },
        { id: 2, name: 'Fernando', email: 'fernando@example.com' },
      ]),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: 'USER_REPOSITORY', useValue: userRepositoryMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of users', async () => {
    const result = await service.getUsers();
    expect(result).toEqual([
      { id: 1, name: 'Jonathan', email: 'jonathan@example.com' },
      { id: 2, name: 'Fernando', email: 'fernando@example.com' },
    ]);
    expect(userRepositoryMock.findAll).toHaveBeenCalledWith({
      attributes: ['id', 'name', 'email'],
    });
  });

  it('should throw an error if repository fails', async () => {
    jest
      .spyOn(userRepositoryMock, 'findAll')
      .mockRejectedValueOnce(new Error('Failed'));

    await expect(service.getUsers()).rejects.toThrow('Something went wrong');
  });
});
