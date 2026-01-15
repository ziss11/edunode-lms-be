import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLessonDto {
  @ApiProperty({
    example: 'Lesson Title',
  })
  @IsString({
    message: 'Title must be a string',
  })
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Lesson Course ID',
  })
  @IsString({
    message: 'Course ID must be a string',
  })
  @IsOptional()
  courseId?: string;

  @ApiProperty({
    example: 'Lesson Description',
  })
  @IsString({
    message: 'Description must be a string',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Lesson Content',
  })
  @IsString({
    message: 'Content must be a string',
  })
  @IsOptional()
  content?: string;

  @ApiProperty({
    example: 'Lesson Video URL',
  })
  @IsString({
    message: 'Video URL must be a string',
  })
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({
    example: 'Lesson Duration',
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
    example: 'Lesson Order',
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
    example: 'Lesson Is Free Preview',
  })
  @IsBoolean({
    message: 'Is Free Preview must be a boolean',
  })
  @IsOptional()
  isFreePreview?: boolean;
}
