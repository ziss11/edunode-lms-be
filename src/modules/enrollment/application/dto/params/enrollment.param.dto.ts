import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EnrollmentParamDto {
  @ApiProperty()
  @IsString({
    message: 'ID must be a string',
  })
  @IsNotEmpty({
    message: 'ID is required',
  })
  id: string;
}
