/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '../../../../common/exceptions/unauthorized.exception';

export interface JwtPayload {
  sessionId: string;
  sub: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(
    id: string,
    userId: string,
    email: string,
    role: string,
  ): string {
    const payload: JwtPayload = {
      sessionId: id,
      sub: userId,
      email,
      role,
      type: 'access',
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: Number(this.configService.get('jwt.expiresIn')),
    });
  }

  generateRefreshToken(
    id: string,
    userId: string,
    email: string,
    role: string,
  ): string {
    const payload: JwtPayload = {
      sessionId: id,
      sub: userId,
      email,
      role,
      type: 'refresh',
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: Number(this.configService.get<string>('jwt.refreshExpiresIn')),
    });
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch (_) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  calculateRefreshTokenExpiry(): Date {
    const expiresIn = Number(
      this.configService.get<string>('jwt.refreshExpiresIn'),
    );
    return new Date(Date.now() + expiresIn * 1000);
  }
}
