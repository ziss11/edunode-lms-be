import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  AnyColumn,
  asc,
  desc,
  eq,
  ilike,
  or,
  SQL,
  sql,
  SQLWrapper,
} from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM } from '../../../../shared/database/postgres/drizzle.module';
import { UserEntity } from '../../domain/entities/user.entity';
import {
  IUserRepository,
  UserFindAllOptions,
} from '../../domain/repositories/user.repository.interface';
import { UserMapper } from './mappers/user.mapper';
import { users } from './schema/user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: PostgresJsDatabase) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const userData = UserMapper.toPersistence(user);
    const [created] = await this.db.insert(users).values(userData).returning();
    return UserMapper.toDomain(created);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const [result] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result ? UserMapper.toDomain(result) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const [result] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result ? UserMapper.toDomain(result) : null;
  }

  async findAll(
    options: UserFindAllOptions,
  ): Promise<{ users: UserEntity[]; total: number }> {
    const { page = 1, limit = 10, orderBy, orderDirection, filters } = options;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    if (filters?.role) {
      conditions.push(eq(users.role, filters.role));
    }
    if (filters?.isActive !== undefined) {
      conditions.push(eq(users.isActive, filters.isActive ? 'true' : 'false'));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(users.email, `%${filters.search}%`),
          ilike(users.firstName, `%${filters.search}%`),
          ilike(users.lastName, `%${filters.search}%`),
        )!,
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    let sortColumn: SQLWrapper | AnyColumn = users.createdAt;

    if (orderBy === 'id') sortColumn = users.id;
    else if (orderBy === 'createdAt') sortColumn = users.createdAt;

    const [userRows, [{ count }]] = await Promise.all([
      this.db
        .select()
        .from(users)
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(orderDirection === 'asc' ? asc(sortColumn) : desc(sortColumn)),
      this.db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(users)
        .where(whereClause),
    ]);

    return {
      users: userRows.map((row) => UserMapper.toDomain(row)),
      total: count,
    };
  }

  async exists(email: string): Promise<boolean> {
    const [result] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return !!result;
  }

  async update(id: string, user: UserEntity): Promise<UserEntity | null> {
    const updateData = UserMapper.toPersistence(user);
    const [updated] = await this.db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    if (!updated) {
      return null;
    }
    return UserMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
