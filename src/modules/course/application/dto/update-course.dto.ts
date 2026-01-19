import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CourseLevel } from '../../domain/enums/course-level.enum';

export class UpdateCourseDto {
  @ApiPropertyOptional({
    example: 'title',
  })
  @IsString({
    message: 'Title must be a string',
  })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'description',
  })
  @IsString({
    message: 'Description must be a string',
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'instructorId',
  })
  @IsString({
    message: 'Instructor ID must be a string',
  })
  @IsOptional()
  instructorId?: string;

  @ApiPropertyOptional({
    example: CourseLevel.BEGINNER,
  })
  @IsEnum(CourseLevel, {
    message: 'Level must be a valid course level',
  })
  @IsOptional()
  level?: CourseLevel;

  @ApiPropertyOptional({
    example: 0,
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
    example: 0,
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
    example: 'https://example.com/cover-image.jpg',
  })
  @IsString({
    message: 'Cover Image URL must be a string',
  })
  @IsOptional()
  coverImageUrl?: string;
}
