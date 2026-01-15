import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CourseLevel } from '../../../domain/enums/course-level.enum';

export class ListCoursesQueryDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty()
  @IsEnum(['id', 'createdAt'])
  @IsOptional()
  orderBy?: 'id' | 'createdAt';

  @ApiProperty()
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  orderDirection?: 'asc' | 'desc';

  @ApiProperty()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  instructorId?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty()
  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  minDuration?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  maxDuration?: number;
}
