import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM } from '../../../../shared/database/postgres/drizzle.module';
import { AuthenticationEntity } from '../../domain/entities/authentication.entity';
import { IAuthenticationRepository } from '../../domain/repositories/authentication.repository.interface';
import { AuthenticationMapper } from './mappers/authentication.mapper';
import { authentications } from './schema/authentication.schema';

@Injectable()
export class AuthenticationRepository implements IAuthenticationRepository {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: PostgresJsDatabase) {}

  async create(authentication: AuthenticationEntity): Promise<void> {
    const authData = AuthenticationMapper.toPersistence(authentication);
    await this.db.insert(authentications).values(authData);
  }

  async findByToken(token: string): Promise<AuthenticationEntity | null> {
    const [result] = await this.db
      .select()
      .from(authentications)
      .where(eq(authentications.token, token))
      .limit(1);
    return result ? AuthenticationMapper.toDomain(result) : null;
  }

  async findByUserId(userId: string): Promise<AuthenticationEntity | null> {
    const [result] = await this.db
      .select()
      .from(authentications)
      .where(eq(authentications.userId, userId))
      .limit(1);
    return result ? AuthenticationMapper.toDomain(result) : null;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.db
      .delete(authentications)
      .where(eq(authentications.userId, userId));
  }

  async deleteByToken(token: string): Promise<void> {
    await this.db
      .delete(authentications)
      .where(eq(authentications.token, token));
  }
}
