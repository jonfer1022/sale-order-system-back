import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { User } from 'src/database/models';
import { RequestAuth } from 'src/auth/types/request.type';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

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

    try {
      if (!accessToken) {
        this.accessDenied(req.url, res);
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

        if (!user || !user.hashRt) {
          this.accessDenied(req.url, res);
        }
        req.user.id = user.id;
      }
      next();
    } catch (error) {
      console.log('-----> ~ AuthMiddleware ~ error:', error);
      this.accessDenied(req.url, res);
    }
  }

  private accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      message: 'Access Denied',
      error: 'Forbidden',
      path: url,
      timestamp: new Date().toISOString(),
    });
  }
}
