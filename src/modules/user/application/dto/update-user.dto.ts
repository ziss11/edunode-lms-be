import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../domain/enums/user-role.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: String,
    example: 'email',
  })
  @IsEmail({}, { message: 'Email must be a valid email' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'firstName',
  })
  @IsString({
    message: 'First name must be a string',
  })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'lastName',
  })
  @IsString({
    message: 'Last name must be a string',
  })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    type: String,
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole, {
    message: 'Role must be a between admin, student and instructor',
  })
  @IsOptional()
  role: UserRole = UserRole.ADMIN;
}
