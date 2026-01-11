import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserParamDto {
  @ApiProperty()
  @IsString({
    message: 'ID must be a valid string',
  })
  id: string;
}
