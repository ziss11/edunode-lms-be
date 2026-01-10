import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM } from '../../../../shared/database/postgres/drizzle.module';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
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
    const [result] = await this.db.select().from(users).where(eq(users.id, id));
    return UserMapper.toDomain(result);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const [result] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return UserMapper.toDomain(result);
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ users: UserEntity[]; total: number }> {
    const offset = (page - 1) * limit;

    const [userRows, [{ count }]] = await Promise.all([
      this.db
        .select()
        .from(users)
        .limit(limit)
        .offset(offset)
        .orderBy(users.createdAt),
      this.db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(users),
    ]);

    return {
      users: userRows.map((user) => UserMapper.toDomain(user)),
      total: count,
    };
  }

  async exists(email: string): Promise<boolean> {
    const [result] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return !!result;
  }

  async update(id: string, user: UserEntity): Promise<UserEntity | null> {
    const updateData = UserMapper.toPersistence(user);
    const [updated] = await this.db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return UserMapper.toDomain(updated);
  }

  async updatePassword(id: string, password: string): Promise<boolean> {
    const [updated] = await this.db
      .update(users)
      .set({ password, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return !!updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
