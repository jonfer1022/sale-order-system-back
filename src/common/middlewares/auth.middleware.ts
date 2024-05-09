import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { User } from 'src/database/models';
import { RequestAuth } from 'src/auth/types/request.type';
import { JwtService } from '@nestjs/jwt';

interface IUserVerified {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
    private jwtService: JwtService,
  ) {}

  async use(req: RequestAuth, res: Response, next: (error?: any) => void) {
    const { authorization } = req.headers;
    const accessToken = authorization?.split('Bearer ')[1];

    if (!accessToken) {
      throw new Error('Unauthorized');
    } else {
      const userVerified: IUserVerified = await this.jwtService.verifyAsync(
        accessToken,
        {
          secret: process.env.JWT_SECRET,
        },
      );

      req.user = {
        token: accessToken,
        sub: userVerified.sub,
        email: userVerified.email,
      };

      const user = await this.userRepository.findOne({
        where: { email: req.user.email },
      });

      if (!user) throw new Error('User not found');
      if (!user.hashRt) {
        throw new Error('Unauthorized');
      }
      req.user.id = user.id;
    }
    next();
  }
}
