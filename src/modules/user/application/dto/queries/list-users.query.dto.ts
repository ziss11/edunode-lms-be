import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../../../domain/enums/user-role.enum';

export class ListUsersQueryDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Search query must be a string' })
  search?: string;

  @ApiPropertyOptional({
    enum: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT],
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Role must be a between admin, student and instructor',
  })
  role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: 'Active status must be a boolean' })
  isActive?: boolean;

  @IsEnum(['id', 'createdAt'])
  @IsOptional()
  orderBy?: 'id' | 'createdAt';

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  orderDirection?: 'asc' | 'desc';
}
