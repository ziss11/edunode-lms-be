import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'refreshToken' })
  @IsString({
    message: 'Refresh token must be a string',
  })
  refreshToken: string;
}
