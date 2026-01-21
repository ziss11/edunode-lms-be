import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateProgressDto {
  @ApiProperty({
    example: 50,
  })
  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    {
      message: 'Progress must be a number',
    },
  )
  @Min(0, {
    message: 'Progress must be greater than or equal to 0',
  })
  @Max(100, {
    message: 'Progress must be less than or equal to 100',
  })
  @IsNotEmpty({
    message: 'Progress is required',
  })
  progress: number;
}
