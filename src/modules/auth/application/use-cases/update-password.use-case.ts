import { Inject, Injectable } from '@nestjs/common';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../../common/exceptions';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import type { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(id: string, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await user.validatePassword(
      dto.currentPassword,
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is invalid');
    }

    await user.changePassword(dto.newPassword);
    await this.userRepository.update(id, user);

    await this.authRepository.deleteByUserId(id);
  }
}
