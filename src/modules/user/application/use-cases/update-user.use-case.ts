import { Inject, Injectable } from '@nestjs/common';
import {
  ConflictException,
  NotFoundException,
} from '../../../../common/exceptions';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
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
      throw new ConflictException('Email already used');
    }

    exists.update(dto.email, dto.fullName, dto.role);

    const user = await this.userRepository.update(id, exists);
    return new UserResponseDto(user);
  }
}
