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
import { AuthResponseDto } from '../dto/auth.response.dto';

export class RefreshTokenUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IAuthenticationRepository')
    private readonly authenticationRepository: IAuthenticationRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(userId: string): Promise<AuthResponseDto> {
    const auth = await this.authenticationRepository.findByUserId(userId);
    if (!auth) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = this.tokenService.verifyRefreshToken(auth.token);
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const hashedToken = await HashUtil.hash(auth.token);
    const storedToken =
      await this.authenticationRepository.findByToken(hashedToken);
    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.isExpired()) {
      throw new UnauthorizedException('Refresh token is expired');
    }

    await this.authenticationRepository.deleteByToken(hashedToken);

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
