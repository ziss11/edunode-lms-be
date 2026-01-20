import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConflictException } from '../../../../common/exceptions';
import { HashUtil } from '../../../../common/utils/hash.util';
import { UserEntity } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user.response.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists) {
      throw new ConflictException('User already exists');
    }

    const password = await HashUtil.hash(dto.password);
    const payload = new UserEntity(
      randomUUID(),
      dto.email,
      password,
      dto.fullName,
      dto.role,
      true,
      new Date(),
      new Date(),
    );

    const user = await this.userRepository.create(payload);
    return new UserResponseDto(user);
  }
}
