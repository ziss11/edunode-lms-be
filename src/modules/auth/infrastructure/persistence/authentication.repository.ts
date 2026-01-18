import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../../generated/prisma/client';
import { PRISMA_ORM } from '../../../../shared/database/postgres/prisma.module';
import { AuthenticationEntity } from '../../domain/entities/authentication.entity';
import { IAuthenticationRepository } from '../../domain/repositories/authentication.repository.interface';
import { AuthenticationMapper } from './mappers/authentication.mapper';

@Injectable()
export class AuthenticationRepository implements IAuthenticationRepository {
  constructor(@Inject(PRISMA_ORM) private readonly db: PrismaClient) {}

  async create(authentication: AuthenticationEntity): Promise<void> {
    const data = AuthenticationMapper.toPayload(authentication);
    await this.db.authentications.create({ data });
  }

  async findByToken(token: string): Promise<AuthenticationEntity | null> {
    const result = await this.db.authentications.findFirst({
      where: { token },
    });
    return result ? AuthenticationMapper.toDomain(result) : null;
  }

  async findByUserId(userId: string): Promise<AuthenticationEntity | null> {
    const result = await this.db.authentications.findFirst({
      where: { userId },
    });
    return result ? AuthenticationMapper.toDomain(result) : null;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.db.authentications.deleteMany({ where: { userId } });
  }
}
