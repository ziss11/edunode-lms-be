import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({
    example: 'title',
  })
  @IsString({
    message: 'Title must be a string',
  })
  title: string;

  @ApiProperty({
    example: 'courseId',
  })
  @IsString({
    message: 'Course ID must be a string',
  })
  courseId: string;

  @ApiProperty({
    example: 'description',
  })
  @IsString({
    message: 'Description must be a string',
  })
  description: string;

  @ApiProperty({
    example: 'content',
  })
  @IsString({
    message: 'Content must be a string',
  })
  content: string;

  @ApiProperty({
    example: 'videoUrl',
  })
  @IsString({
    message: 'Video URL must be a string',
  })
  videoUrl: string;

  @ApiProperty({
    example: 0,
  })
  @IsNumber(
    {},
    {
      message: 'Duration must be a number',
    },
  )
  duration: number;

  @ApiProperty({
    example: 0,
  })
  @IsNumber(
    {},
    {
      message: 'Order must be a number',
    },
  )
  order: number;

  @ApiProperty({
    example: true,
  })
  @IsBoolean({
    message: 'Is Free Preview must be a boolean',
  })
  isFreePreview: boolean;
}
