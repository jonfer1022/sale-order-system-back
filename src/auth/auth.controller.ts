import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthSignupDto } from './dto';
import { Tokens } from './types/tokens.type';
import { RequestAuth } from './types/request.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @HttpCode(HttpStatus.CREATED)
  async signin(@Body() dto: AuthDto): Promise<Tokens> {
    return await this.authService.signin(dto);
  }

  @Post('/signup')
  @HttpCode(HttpStatus.OK)
  async signup(@Body() dto: AuthSignupDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: RequestAuth) {
    return this.authService.logout(req.user.id);
  }

  // @Post('/refresh')
  // @HttpCode(HttpStatus.OK)
  // async refreshTokens(
  //   @GetCurrentUserId() userId: number,
  //   @GetCurrentUser('refreshToken') refreshToken: string,
  // ): Promise<Tokens> {
  //   return this.authService.refreshTokens(userId, refreshToken);
  // }
}
