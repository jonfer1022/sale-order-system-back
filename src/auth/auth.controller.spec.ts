import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Tokens } from './types/tokens.type';
import { AuthDto, AuthSignupDto } from './dto';
import { RequestAuth } from './types/request.type';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signin: jest.fn(),
            signup: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signin', () => {
    it('should return tokens', async () => {
      const tokens: Tokens = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };
      const authDto: AuthDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(authService, 'signin').mockResolvedValue(tokens);

      expect(await controller.signin(authDto)).toBe(tokens);
      expect(authService.signin).toHaveBeenCalledWith(authDto);
    });
  });

  describe('signup', () => {
    it('should return tokens', async () => {
      const tokens: Tokens = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };
      const authSignupDto: AuthSignupDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };

      jest.spyOn(authService, 'signup').mockResolvedValue(tokens);

      expect(await controller.signup(authSignupDto)).toBe(tokens);
      expect(authService.signup).toHaveBeenCalledWith(authSignupDto);
    });
  });

  describe('logout', () => {
    it('should return "User logged out"', async () => {
      const req: Partial<RequestAuth> = {
        user: { id: 'user_id' },
      } as Partial<RequestAuth>;

      jest.spyOn(authService, 'logout').mockResolvedValue('User logged out');

      expect(await controller.logout(req as RequestAuth)).toBe(
        'User logged out',
      );
      expect(authService.logout).toHaveBeenCalledWith(req.user.id);
    });
  });
});
