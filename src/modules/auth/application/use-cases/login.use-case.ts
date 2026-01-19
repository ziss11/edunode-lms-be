import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UnauthorizedException } from '../../../../common/exceptions';
import { HashUtil } from '../../../../common/utils/hash.util';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import { AuthEntity } from '../../domain/entities/auth.entity';
import type { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';
import { LoginDto } from '../dto/login.dto';
import { TokenResponseDto } from '../dto/token.response.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto): Promise<TokenResponseDto> {
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

    const payload = new AuthEntity(
      randomUUID(),
      user.id,
      await HashUtil.hash(refreshToken),
      this.tokenService.calculateRefreshTokenExpiry(),
      new Date(),
    );
    await this.authRepository.create(payload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
