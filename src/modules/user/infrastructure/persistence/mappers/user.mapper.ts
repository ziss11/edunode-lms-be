import { Users } from '../../../../../../generated/prisma/client';
import { UsersCreateInput } from '../../../../../../generated/prisma/models';
import { UserResponseDto } from '../../../application/dto/user.response.dto';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRole } from '../../../domain/enums/user-role.enum';

export class UserMapper {
  static toDomain(row: Users): UserEntity {
    return new UserEntity(
      row.id,
      row.email,
      row.password,
      row.fullName,
      row.role as UserRole,
      row.isActive,
      row.createdAt,
      row.updatedAt,
    );
  }

  static toResponse(entity: UserEntity): UserResponseDto {
    return new UserResponseDto({
      id: entity.id,
      email: entity.email,
      fullName: entity.fullName,
      role: entity.role,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPayload(entity: UserEntity): UsersCreateInput {
    return {
      id: entity.id,
      email: entity.email,
      password: entity.password,
      fullName: entity.fullName,
      role: entity.role,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
