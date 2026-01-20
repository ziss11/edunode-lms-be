import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../../generated/prisma/client';
import { PRISMA_ORM } from '../../../../shared/database/postgres/prisma.module';
import { AuthEntity } from '../../domain/entities/auth.entity';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { AuthMapper } from './mappers/auth.mapper';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@Inject(PRISMA_ORM) private readonly db: PrismaClient) {}

  async create(authentication: AuthEntity): Promise<void> {
    const data = AuthMapper.toPayload(authentication);
    await this.db.authentications.create({ data });
  }

  async findByToken(token: string): Promise<AuthEntity | null> {
    const result = await this.db.authentications.findFirst({
      where: { token },
    });
    return result ? AuthMapper.toDomain(result) : null;
  }

  async findByUserId(userId: string): Promise<AuthEntity | null> {
    const result = await this.db.authentications.findFirst({
      where: { userId },
    });
    return result ? AuthMapper.toDomain(result) : null;
  }

  async findById(id: string): Promise<AuthEntity | null> {
    const result = await this.db.authentications.findUnique({
      where: { id },
    });
    return result ? AuthMapper.toDomain(result) : null;
  }

  async delete(id: string): Promise<void> {
    await this.db.authentications.delete({ where: { id } });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.db.authentications.deleteMany({ where: { userId } });
  }
}
