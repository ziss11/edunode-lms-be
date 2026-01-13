import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({ example: 'accessToken' })
  accessToken: string;

  @ApiProperty({ example: 'refreshToken' })
  refreshToken: string;

  constructor({ accessToken, refreshToken }: TokenResponseDto) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
