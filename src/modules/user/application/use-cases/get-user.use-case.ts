import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '../../../../common/exceptions';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserMapper } from '../../infrastructure/persistence/mappers/user.mapper';
import { UserResponseDto } from '../dto/user.response.dto';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserMapper.toResponse(user);
  }
}
