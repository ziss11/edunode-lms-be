import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { Email } from '../../../domain/value-objects/email.vo';
import { Password } from '../../../domain/value-objects/password.vo';
import { UserRow } from '../schema/user.schema';

export class UserMapper {
  static toDomain(row: UserRow): UserEntity {
    return new UserEntity(
      row.id,
      new Email(row.email),
      Password.fromHash(row.password),
      row.firstName,
      row.lastName,
      row.role as UserRole,
      row.isActive === 'true',
      row.createdAt,
      row.updatedAt,
    );
  }

  static toPersistence(entity: UserEntity): UserRow {
    return {
      id: entity.id,
      email: entity.email.getValue(),
      password: entity.password.getValue(),
      firstName: entity.firstName,
      lastName: entity.lastName,
      role: entity.role,
      isActive: entity.isActive ? 'true' : 'false',
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
