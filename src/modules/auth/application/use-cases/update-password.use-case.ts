import { Inject, Injectable } from '@nestjs/common';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../../common/exceptions';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import { Password } from '../../../user/domain/value-objects/password.vo';
import type { IAuthenticationRepository } from '../../domain/repositories/authentication.repository.interface';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IAuthenticationRepository')
    private readonly authenticationRepository: IAuthenticationRepository,
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

    const newPassword = await Password.create(dto.newPassword);

    user.changePassword(newPassword);
    await this.userRepository.update(id, user);

    await this.authenticationRepository.deleteByUserId(id);
  }
}
