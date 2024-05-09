import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

import { AuthDto, AuthSignupDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/models';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
    private jwtService: JwtService,
  ) {}

  async hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          expiresIn: 60 * 60, // 1 hour
          secret: process.env.JWT_SECRET,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          expiresIn: 60 * 60 * 24 * 7, // 7 days
          secret: process.env.JWT_SECRET_REFRESH,
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt); // hash the refresh token
    await this.userRepository.update(
      { hashRt: hash },
      { where: { id: userId } },
    );
  }

  async signin(dto: AuthDto): Promise<Tokens> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const pwMatches = await bcrypt.compare(dto.password, user.passHash);

    if (!pwMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async signup(dto: AuthSignupDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    const user = await this.userRepository.create({
      email: dto.email,
      name: dto.name,
      passHash: hash,
    });

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.userRepository.update(
      { hashRt: null },
      { where: { id: userId } },
    );
    return 'User logged out';
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.hashRt) throw new ForbiddenException('Access Denied');
    const rtMatches = await bcrypt.compare(rt, user.hashRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }
}
