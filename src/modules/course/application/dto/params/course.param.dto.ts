import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CourseParamDto {
  @ApiProperty()
  @IsString({
    message: 'ID must be a string',
  })
  id: string;
}
