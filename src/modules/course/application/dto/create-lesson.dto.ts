import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({
    example: 'Lesson Title',
  })
  @IsString({
    message: 'Title must be a string',
  })
  title: string;

  @ApiProperty({
    example: 'Lesson Course ID',
  })
  @IsString({
    message: 'Course ID must be a string',
  })
  courseId: string;

  @ApiProperty({
    example: 'Lesson Description',
  })
  @IsString({
    message: 'Description must be a string',
  })
  description: string;

  @ApiProperty({
    example: 'Lesson Content',
  })
  @IsString({
    message: 'Content must be a string',
  })
  content: string;

  @ApiProperty({
    example: 'Lesson Video URL',
  })
  @IsString({
    message: 'Video URL must be a string',
  })
  videoUrl: string;

  @ApiProperty({
    example: 'Lesson Duration',
  })
  @IsNumber(
    {},
    {
      message: 'Duration must be a number',
    },
  )
  duration: number;

  @ApiProperty({
    example: 'Lesson Order',
  })
  @IsNumber(
    {},
    {
      message: 'Order must be a number',
    },
  )
  order: number;

  @ApiProperty({
    example: 'Lesson Is Free Preview',
  })
  @IsBoolean({
    message: 'Is Free Preview must be a boolean',
  })
  isFreePreview: boolean;
}
