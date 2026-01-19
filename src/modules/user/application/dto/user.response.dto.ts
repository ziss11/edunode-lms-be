import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../domain/enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty({ example: 'id' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'fullName' })
  fullName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  role: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(user: Partial<UserResponseDto>) {
    this.id = user.id || this.id;
    this.email = user.email || this.email;
    this.fullName = user.fullName || this.fullName;
    this.role = user.role || this.role;
    this.isActive = user.isActive || this.isActive;
    this.createdAt = user.createdAt || this.createdAt;
    this.updatedAt = user.updatedAt || this.updatedAt;
  }
}
