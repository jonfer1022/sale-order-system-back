import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types/tokens.type';

const mockUserRepository = {
  findOne: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUserRepository,
        },
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should sign in user and return tokens', async () => {
      const authDto = { email: 'test@example.com', password: 'password' };
      const tokens: Tokens = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };

      mockUserRepository.findOne.mockResolvedValueOnce({
        id: 'user_id',
        email: 'test@example.com',
        passHash: await bcrypt.hash('password', 10),
        update: jest.fn(),
      });

      mockUserRepository.update.mockResolvedValueOnce({
        id: 'user_id',
        email: 'test@example.com',
        passHash: await bcrypt.hash('password', 10),
        update: jest.fn(),
      });

      jest.spyOn(service, 'getTokens').mockResolvedValueOnce(tokens);

      expect(await service.signin(authDto)).toEqual(tokens);
    });

    it('should throw ForbiddenException when user not found in signin process', async () => {
      const authDto = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.signin(authDto)).rejects.toThrow('Access Denied');
    });

    it('should throw ForbiddenException when password does not match in signin process', async () => {
      const authDto = {
        email: 'test@example.com',
        password: 'incorrect_password',
      };

      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce({
        id: 'user_id',
        email: 'test@example.com',
        passHash: await bcrypt.hash('password', 10),
        update: jest.fn(),
      });

      await expect(service.signin(authDto)).rejects.toThrow('Access Denied');
    });
  });

  describe('signup', () => {
    it('should sign up user and return tokens', async () => {
      const authSignupDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      const tokens: Tokens = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };

      mockUserRepository.create.mockResolvedValueOnce({
        id: 'user_id',
        email: 'test@example.com',
        passHash: await bcrypt.hash('password', 10),
      });

      jest.spyOn(service, 'getTokens').mockResolvedValueOnce(tokens);

      expect(await service.signup(authSignupDto)).toEqual(tokens);
    });
  });

  describe('logout', () => {
    it('should log out user and return message', async () => {
      const userId = 'user_id';
      const expectedMessage = 'User logged out';

      mockUserRepository.update.mockResolvedValueOnce({
        id: 'user_id',
        email: 'test@example.com',
        passHash: await bcrypt.hash('password', 10),
        update: jest.fn(),
      });

      expect(await service.logout(userId)).toBe(expectedMessage);
    });
  });
});
