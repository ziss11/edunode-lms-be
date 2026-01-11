import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { ListUserQueryDto } from '../dto/queries/list-user.query.dto';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    query: ListUserQueryDto,
  ): Promise<{ users: UserEntity[]; total: number }> {
    return await this.userRepository.findAll({
      page: query.page,
      limit: query.limit,
      orderBy: query.orderBy,
      orderDirection: query.orderDirection,
      filters: {
        search: query.search,
        role: query.role,
        isActive: query.isActive,
      },
    });
  }
}
