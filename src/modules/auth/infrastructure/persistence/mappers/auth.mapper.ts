import { Authentications } from '../../../../../../generated/prisma/client';
import { AuthenticationsCreateInput } from '../../../../../../generated/prisma/models';
import { AuthEntity } from '../../../domain/entities/auth.entity';

export class AuthMapper {
  static toDomain(row: Authentications): AuthEntity {
    return new AuthEntity(
      row.id,
      row.id,
      row.token,
      row.expiresAt,
      row.createdAt,
    );
  }

  static toPayload(entity: AuthEntity): AuthenticationsCreateInput {
    return {
      id: entity.id,
      userId: entity.userId,
      token: entity.token,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
    };
  }
}
