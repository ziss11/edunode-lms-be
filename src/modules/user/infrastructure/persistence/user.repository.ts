import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../../generated/prisma/client';
import { UsersWhereInput } from '../../../../../generated/prisma/models';
import { PRISMA_ORM } from '../../../../shared/database/postgres/prisma.module';
import { UserEntity } from '../../domain/entities/user.entity';
import {
  IUserRepository,
  UserFindAllOptions,
} from '../../domain/repositories/user.repository.interface';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@Inject(PRISMA_ORM) private readonly db: PrismaClient) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const data = UserMapper.toPayload(user);
    const created = await this.db.users.create({ data });
    return UserMapper.toDomain(created);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const result = await this.db.users.findFirst({ where: { id } });
    return result ? UserMapper.toDomain(result) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const result = await this.db.users.findFirst({ where: { email } });
    return result ? UserMapper.toDomain(result) : null;
  }

  async findAll(
    options: UserFindAllOptions,
  ): Promise<{ users: UserEntity[]; total: number }> {
    const { page = 1, limit = 10, orderBy, orderDirection, filters } = options;
    const offset = (page - 1) * limit;

    const conditions: UsersWhereInput = {};

    if (filters?.role) {
      conditions.role = filters.role;
    }
    if (filters?.isActive !== undefined) {
      conditions.isActive = filters.isActive;
    }
    if (filters?.search) {
      conditions.email = {
        contains: filters.search,
      };
      conditions.firstName = {
        contains: filters.search,
      };
      conditions.lastName = {
        contains: filters.search,
      };
    }

    const [userRows, count] = await this.db.$transaction([
      this.db.users.findMany({
        take: limit,
        skip: offset,
        where: conditions,
        orderBy: {
          [orderBy as string]: orderDirection,
        },
      }),
      this.db.users.count({ where: conditions }),
    ]);
    return {
      users: userRows.map((user) => UserMapper.toDomain(user)),
      total: count,
    };
  }

  async exists(email: string): Promise<boolean> {
    const result = await this.db.users.findUnique({ where: { email } });
    return !!result;
  }

  async update(id: string, user: UserEntity): Promise<UserEntity | null> {
    const updateData = UserMapper.toPayload(user);
    const updated = await this.db.users.update({
      where: { id },
      data: { ...updateData, updatedAt: new Date() },
    });
    return updated ? UserMapper.toDomain(updated) : null;
  }

  async delete(id: string): Promise<void> {
    await this.db.users.delete({ where: { id } });
  }
}
