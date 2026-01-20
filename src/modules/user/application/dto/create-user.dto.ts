import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '../../domain/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'email',
    required: true,
  })
  @IsEmail({}, { message: 'Email format is invalid' })
  email: string;

  @ApiProperty({
    type: String,
    example: 'fullName',
    required: true,
  })
  @IsString({
    message: 'Full name must be a string',
  })
  fullName: string;

  @ApiProperty({
    type: String,
    example: 'password',
    required: true,
  })
  @IsString({
    message: 'Password must be a string',
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long.',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter.',
  })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter.',
  })
  @Matches(/[0-9]/, {
    message: 'Password must contain at least one number.',
  })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password must contain at least one special character.',
  })
  password: string;

  @ApiProperty({
    type: String,
    enum: UserRole,
    example: 'admin',
    required: true,
  })
  @IsEnum(UserRole, {
    message: 'Role must be a between admin, student and instructor',
  })
  role: UserRole;
}
