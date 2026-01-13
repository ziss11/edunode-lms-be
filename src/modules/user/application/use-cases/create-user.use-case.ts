import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConflictException } from '../../../../common/exceptions';
import { UserEntity } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
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

    const email = new Email(dto.email);
    const password = await Password.create(dto.password);

    const payload = new UserEntity(
      randomUUID(),
      email,
      password,
      dto.firstName,
      dto.lastName,
      dto.role,
      true,
      new Date(),
      new Date(),
    );

    const user = await this.userRepository.create(payload);
    return new UserResponseDto({
      ...user,
      email: user.email.getValue(),
    });
  }
}
