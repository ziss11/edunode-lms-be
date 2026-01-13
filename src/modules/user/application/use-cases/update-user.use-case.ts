import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '../../../../common/exceptions';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.vo';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user.response.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
    const exists = await this.userRepository.findById(id);
    if (!exists) {
      throw new NotFoundException('User not found');
    }

    const emailExists = await this.userRepository.findByEmail(dto.email ?? '');
    if (emailExists) {
      throw new NotFoundException('Email already used');
    }

    const email = new Email(dto.email ?? '');
    const payload = exists.update(
      email,
      dto.firstName ?? '',
      dto.lastName ?? '',
      dto.role,
    );

    const user = await this.userRepository.update(id, payload);
    return new UserResponseDto({ ...user, email: user?.email.getValue() });
  }
}
