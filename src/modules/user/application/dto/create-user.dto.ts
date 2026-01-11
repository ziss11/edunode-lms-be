import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { UserRole } from '../../domain/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'email',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: 'firstName',
    required: true,
  })
  @IsString({
    message: 'First name must be a string',
  })
  firstName: string;

  @ApiProperty({
    type: String,
    example: 'lastName',
    required: true,
  })
  @IsString({
    message: 'Last name must be a string',
  })
  lastName: string;

  @ApiProperty({
    type: String,
    example: 'password',
    required: true,
  })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
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
