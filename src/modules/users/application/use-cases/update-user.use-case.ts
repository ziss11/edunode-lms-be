import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '../../../../common/exceptions';
import { UserEntity } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.vo';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<UserEntity | null> {
    const exists = await this.userRepository.findById(id);
    if (!exists) {
      throw new NotFoundException('User not found');
    }

    const emailExists = await this.userRepository.exists(dto.email);
    if (emailExists) {
      throw new NotFoundException('Email already used');
    }

    const email = new Email(dto.email);
    const user = new UserEntity(
      id,
      email,
      exists.password,
      dto.firstName,
      dto.lastName,
      dto.role,
      exists.isActive,
      exists.createdAt,
      new Date(),
    );

    return this.userRepository.update(id, user);
  }
}
