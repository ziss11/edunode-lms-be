import { AuthenticationEntity } from '../../../domain/entities/authentication.entity';
import { AuthenticationRow } from '../schema/authentication.schema';

export class AuthenticationMapper {
  static toDomain(row: AuthenticationRow): AuthenticationEntity {
    return new AuthenticationEntity(
      row.id,
      row.id,
      row.token,
      row.expiresAt,
      row.createdAt,
    );
  }

  static toPersistence(entity: AuthenticationEntity): AuthenticationRow {
    return {
      id: entity.id,
      userId: entity.userId,
      token: entity.token,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
    };
  }
}
