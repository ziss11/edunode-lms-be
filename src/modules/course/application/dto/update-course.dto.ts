import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CourseLevel } from '../../domain/enums/course-level.enum';

export class UpdateCourseDto {
  @ApiPropertyOptional({
    example: 'Course Title',
  })
  @IsString({
    message: 'Title must be a string',
  })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'Course Description',
  })
  @IsString({
    message: 'Description must be a string',
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'Instructor ID',
  })
  @IsString({
    message: 'Instructor ID must be a string',
  })
  @IsOptional()
  instructorId?: string;

  @ApiPropertyOptional({
    example: 'Course Level',
  })
  @IsEnum(CourseLevel, {
    message: 'Level must be a valid course level',
  })
  @IsOptional()
  level?: CourseLevel;

  @ApiPropertyOptional({
    example: 'Course Price',
  })
  @IsNumber(
    {},
    {
      message: 'Price must be a number',
    },
  )
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    example: 'Course Duration',
  })
  @IsNumber(
    {},
    {
      message: 'Duration must be a number',
    },
  )
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({
    example: 'Course Cover Image URL',
  })
  @IsString({
    message: 'Cover Image URL must be a string',
  })
  @IsOptional()
  coverImageUrl?: string;
}
