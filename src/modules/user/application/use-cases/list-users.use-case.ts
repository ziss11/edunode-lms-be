import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserMapper } from '../../infrastructure/persistence/mappers/user.mapper';
import { ListUsersQueryDto } from '../dto/queries/list-users.query.dto';
import { UserResponseDto } from '../dto/user.response.dto';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    queries: ListUsersQueryDto,
  ): Promise<{ users: UserResponseDto[]; total: number }> {
    const result = await this.userRepository.findAll({
      page: queries.page,
      limit: queries.limit,
      orderBy: queries.orderBy,
      orderDirection: queries.orderDirection,
      filters: {
        search: queries.search,
        role: queries.role,
        isActive: queries.isActive,
      },
    });
    return {
      users: result.users.map((user) => UserMapper.toResponse(user)),
      total: result.total,
    };
  }
}
