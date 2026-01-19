import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../../generated/prisma/client';
import { UsersWhereInput } from '../../../../../generated/prisma/models';
import { PRISMA_ORM } from '../../../../shared/database/postgres/prisma.module';
import { UserEntity } from '../../domain/entities/user.entity';
import {
  IUserRepository,
  UserFindAllOptions,
} from '../../domain/repositories/user.repository.interface';
import { UserCacheService } from '../cache/user-cache.service';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject(PRISMA_ORM) private readonly db: PrismaClient,
    private readonly userCacheService: UserCacheService,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const data = UserMapper.toPayload(user);
    const created = await this.db.users.create({ data });

    const result = UserMapper.toDomain(created);
    await this.userCacheService.set(result.id, result);
    await this.userCacheService.invalidateListCache();

    return result;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const cached = await this.userCacheService.get(id);
    if (cached) return cached;

    const user = await this.db.users.findFirst({ where: { id } });
    const result = user ? UserMapper.toDomain(user) : null;
    if (result) await this.userCacheService.set(id, result);

    return result;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const result = await this.db.users.findFirst({ where: { email } });
    return result ? UserMapper.toDomain(result) : null;
  }

  async findAll(
    options: UserFindAllOptions,
  ): Promise<{ users: UserEntity[]; total: number }> {
    const cached = await this.userCacheService.list(options);
    if (cached) return cached;

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

    const result = {
      users: userRows.map((user) => UserMapper.toDomain(user)),
      total: count,
    };
    await this.userCacheService.setList(options, result);

    return result;
  }

  async exists(email: string): Promise<boolean> {
    const result = await this.db.users.findUnique({ where: { email } });
    return !!result;
  }

  async update(id: string, user: UserEntity): Promise<UserEntity> {
    const updateData = UserMapper.toPayload(user);
    const updated = await this.db.users.update({
      where: { id },
      data: { ...updateData, updatedAt: new Date() },
    });

    const result = UserMapper.toDomain(updated);
    await this.userCacheService.set(id, result);
    await this.userCacheService.invalidateListCache();

    return result;
  }

  async delete(id: string): Promise<void> {
    await this.db.users.delete({ where: { id } });
    await this.userCacheService.delete(id);
    await this.userCacheService.invalidateListCache();
  }
}
