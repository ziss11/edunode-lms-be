import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { CourseLevel } from '../../domain/enums/course-level.enum';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Course Title',
  })
  @IsString({
    message: 'Title must be a string',
  })
  title: string;

  @ApiProperty({
    example: 'Course Description',
  })
  @IsString({
    message: 'Description must be a string',
  })
  description: string;

  @ApiProperty({
    example: 'Instructor ID',
  })
  @IsString()
  instructorId: string;

  @ApiProperty({
    example: 'Course Level',
  })
  @IsEnum(CourseLevel, {
    message: 'Level must be a valid course level',
  })
  level: CourseLevel;

  @ApiProperty({
    example: 'Course Price',
  })
  @IsNumber(
    {},
    {
      message: 'Price must be a number',
    },
  )
  price: number;

  @ApiProperty({
    example: 'Course Duration',
  })
  @IsNumber(
    {},
    {
      message: 'Duration must be a number',
    },
  )
  duration: number;

  @ApiProperty({
    example: 'Course Is Published',
  })
  @IsBoolean({
    message: 'Is Published must be a boolean',
  })
  isPublished: boolean;

  @ApiProperty({
    example: 'Course Cover Image URL',
  })
  @IsString({
    message: 'Cover Image URL must be a string',
  })
  coverImageUrl: string;
}
