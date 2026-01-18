import { Authentications } from '../../../../../../generated/prisma/client';
import { AuthenticationsCreateInput } from '../../../../../../generated/prisma/models';
import { AuthenticationEntity } from '../../../domain/entities/authentication.entity';

export class AuthenticationMapper {
  static toDomain(row: Authentications): AuthenticationEntity {
    return new AuthenticationEntity(
      row.id,
      row.id,
      row.token,
      row.expiresAt,
      row.createdAt,
    );
  }

  static toPayload(entity: AuthenticationEntity): AuthenticationsCreateInput {
    return {
      id: entity.id,
      userId: entity.userId,
      token: entity.token,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
    };
  }
}
