import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class FindAllUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    page: number,
    limit: number,
  ): Promise<{ users: UserEntity[]; total: number }> {
    return await this.userRepository.findAll(page, limit);
  }
}
