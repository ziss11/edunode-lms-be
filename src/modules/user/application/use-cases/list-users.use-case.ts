import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { ListUserQueryDto } from '../dto/queries/list-user.query.dto';
import { UserResponseDto } from '../dto/user.response.dto';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    query: ListUserQueryDto,
  ): Promise<{ users: UserResponseDto[]; total: number }> {
    const result = await this.userRepository.findAll({
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
    return {
      users: result.users.map((user) => new UserResponseDto(user)),
      total: result.total,
    };
  }
}
