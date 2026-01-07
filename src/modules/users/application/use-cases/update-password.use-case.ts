import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '../../../../common/exceptions';
import { UserEntity } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Password } from '../../domain/value-objects/password.vo';

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, password: string): Promise<UserEntity | null> {
    const exists = await this.userRepository.findById(id);
    if (!exists) {
      throw new NotFoundException('User not found');
    }

    const newPassword = await Password.create(password);
    const user = exists.updatePassword(newPassword);

    return this.userRepository.update(id, user);
  }
}
