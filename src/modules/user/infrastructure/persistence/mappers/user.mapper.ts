import { Users } from '../../../../../../generated/prisma/client';
import { UsersCreateInput } from '../../../../../../generated/prisma/models';
import { UserResponseDto } from '../../../application/dto/user.response.dto';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { Email } from '../../../domain/value-objects/email.vo';
import { Password } from '../../../domain/value-objects/password.vo';

export class UserMapper {
  static toDomain(row: Users): UserEntity {
    return new UserEntity(
      row.id,
      new Email(row.email),
      Password.fromHash(row.password),
      row.firstName,
      row.lastName,
      row.role as UserRole,
      row.isActive,
      row.createdAt,
      row.updatedAt,
    );
  }

  static toResponse(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email.getValue(),
      fullName: `${entity.firstName} ${entity.lastName}`,
      role: entity.role,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toPayload(entity: UserEntity): UsersCreateInput {
    return {
      id: entity.id,
      email: entity.email.getValue(),
      password: entity.password.getValue(),
      firstName: entity.firstName,
      lastName: entity.lastName,
      role: entity.role,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
