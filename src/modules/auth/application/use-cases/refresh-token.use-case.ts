import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../../common/exceptions';
import { HashUtil } from '../../../../common/utils/hash.util';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import { AuthenticationEntity } from '../../domain/entities/authentication.entity';
import type { IAuthenticationRepository } from '../../domain/repositories/authentication.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { TokenResponseDto } from '../dto/token.response.dto';

export class RefreshTokenUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IAuthenticationRepository')
    private readonly authenticationRepository: IAuthenticationRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<TokenResponseDto> {
    const payload = this.tokenService.verifyRefreshToken(dto.refreshToken);
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const auth = await this.authenticationRepository.findByUserId(payload.sub);
    if (!auth) {
      throw new UnauthorizedException('Session not found');
    }

    const isValidToken = await HashUtil.compare(dto.refreshToken, auth.token);
    if (!isValidToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (auth.isTokenExpired()) {
      await this.authenticationRepository.deleteByUserId(payload.sub);
      throw new UnauthorizedException('Refresh token is expired');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }
    await this.authenticationRepository.deleteByUserId(payload.sub);

    const newAccessToken = this.tokenService.generateAccessToken(
      user.id,
      user.email.getValue(),
      user.role,
    );
    const newRefreshToken = this.tokenService.generateRefreshToken(
      user.id,
      user.email.getValue(),
      user.role,
    );

    const refreshTokenPayload = new AuthenticationEntity(
      randomUUID(),
      user.id,
      await HashUtil.hash(newRefreshToken),
      this.tokenService.calculateRefreshTokenExpiry(),
      new Date(),
    );
    await this.authenticationRepository.create(refreshTokenPayload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
