import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: 'accessToken' })
  accessToken: string;

  @ApiProperty({ example: 'refreshToken' })
  refreshToken: string;

  @ApiProperty({
    example: {
      id: '1',
      email: 'email',
      fullName: 'fullName',
      role: 'role',
    },
  })
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };

  @ApiProperty({ example: 3600 })
  expiresIn: number;
}
