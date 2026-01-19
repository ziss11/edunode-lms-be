import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UnauthorizedException } from '../../../../common/exceptions/unauthorized.exception';
import { HashUtil } from '../../../../common/utils/hash.util';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { UserRole } from '../../../user/domain/enums/user-role.enum';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import { Email } from '../../../user/domain/value-objects/email.vo';
import { Password } from '../../../user/domain/value-objects/password.vo';
import { AuthEntity } from '../../domain/entities/auth.entity';
import type { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';
import { RegisterDto } from '../dto/register.dto';
import { TokenResponseDto } from '../dto/token.response.dto';

export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RegisterDto): Promise<TokenResponseDto> {
    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists) {
      throw new UnauthorizedException('Email is already in use');
    }

    const email = new Email(dto.email);
    const password = await Password.create(dto.password);

    const payload = new UserEntity(
      randomUUID(),
      email,
      password,
      dto.firstName,
      dto.lastName,
      UserRole.STUDENT,
      true,
      new Date(),
      new Date(),
    );
    const createdUser = await this.userRepository.create(payload);

    const accessToken = this.tokenService.generateAccessToken(
      createdUser.id,
      createdUser.email.getValue(),
      createdUser.role,
    );
    const refreshToken = this.tokenService.generateRefreshToken(
      createdUser.id,
      createdUser.email.getValue(),
      createdUser.role,
    );

    const refreshPayload = new AuthEntity(
      randomUUID(),
      createdUser.id,
      await HashUtil.hash(refreshToken),
      this.tokenService.calculateRefreshTokenExpiry(),
      new Date(),
    );
    await this.authRepository.create(refreshPayload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
