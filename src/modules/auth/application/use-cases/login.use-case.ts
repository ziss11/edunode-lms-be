import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UnauthorizedException } from '../../../../common/exceptions';
import { HashUtil } from '../../../../common/utils/hash.util';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import { AuthenticationEntity } from '../../domain/entities/authentication.entity';
import type { IAuthenticationRepository } from '../../domain/repositories/authentication.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';
import { AuthResponseDto } from '../dto/auth.response.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IAuthenticationRepository')
    private readonly refreshTokenRepository: IAuthenticationRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email is invalid');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    const isPasswordMatched = await user.password.compare(dto.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Password is invalid');
    }

    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.email.getValue(),
      user.role,
    );
    const refreshToken = this.tokenService.generateRefreshToken(
      user.id,
      user.email.getValue(),
      user.role,
    );

    const payload = new AuthenticationEntity(
      randomUUID(),
      user.id,
      await HashUtil.hash(refreshToken),
      this.tokenService.calculateRefreshTokenExpiry(),
      new Date(),
    );
    await this.refreshTokenRepository.create(payload);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.tokenService.getAccessTokenExpiresIn(),
      user: {
        id: user.id,
        email: user.email.getValue(),
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
