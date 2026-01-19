import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLessonDto {
  @ApiProperty({
    example: 'title',
  })
  @IsString({
    message: 'Title must be a string',
  })
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'courseId',
  })
  @IsString({
    message: 'Course ID must be a string',
  })
  @IsOptional()
  courseId?: string;

  @ApiProperty({
    example: 'description',
  })
  @IsString({
    message: 'Description must be a string',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'content',
  })
  @IsString({
    message: 'Content must be a string',
  })
  @IsOptional()
  content?: string;

  @ApiProperty({
    example: 'videoUrl',
  })
  @IsString({
    message: 'Video URL must be a string',
  })
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({
    example: 'duration',
  })
  @IsNumber(
    {},
    {
      message: 'Duration must be a number',
    },
  )
  @IsOptional()
  duration?: number;

  @ApiProperty({
    example: 'order',
  })
  @IsNumber(
    {},
    {
      message: 'Order must be a number',
    },
  )
  @IsOptional()
  order?: number;

  @ApiProperty({
    example: true,
  })
  @IsBoolean({
    message: 'Is Free Preview must be a boolean',
  })
  @IsOptional()
  isFreePreview?: boolean;
}
