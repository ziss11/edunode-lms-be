import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { CourseLevel } from '../../domain/enums/course-level.enum';

export class CreateCourseDto {
  @ApiProperty({
    example: 'id',
  })
  @IsString({
    message: 'Title must be a string',
  })
  title: string;

  @ApiProperty({
    example: 'description',
  })
  @IsString({
    message: 'Description must be a string',
  })
  description: string;

  @ApiProperty({
    example: 'instructorId',
  })
  @IsString()
  instructorId: string;

  @ApiProperty({
    example: CourseLevel.BEGINNER,
  })
  @IsEnum(CourseLevel, {
    message: 'Level must be a valid course level',
  })
  level: CourseLevel;

  @ApiProperty({
    example: 0,
  })
  @IsNumber(
    {},
    {
      message: 'Price must be a number',
    },
  )
  price: number;

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
    example: true,
  })
  @IsBoolean({
    message: 'Is Published must be a boolean',
  })
  isPublished: boolean;

  @ApiProperty({
    example: 'https://example.com/cover-image.jpg',
  })
  @IsString({
    message: 'Cover Image URL must be a string',
  })
  coverImageUrl: string;
}
