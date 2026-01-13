import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
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

  generateAccessToken(userId: string, email: string, role: string): string {
    const payload: JwtPayload = {
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

  generateRefreshToken(userId: string, email: string, role: string): string {
    const payload: JwtPayload = {
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
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
    });
  }

  getAccessTokenExpiresIn(): number {
    return Number(this.configService.get<string>('jwt.expiresIn'));
  }

  calculateRefreshTokenExpiry(): Date {
    const expiresIn = Number(
      this.configService.get<string>('jwt.refreshExpiresIn'),
    );
    return new Date(Date.now() + expiresIn * 1000);
  }
}
