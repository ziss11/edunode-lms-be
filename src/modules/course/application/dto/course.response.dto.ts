import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../user/application/dto/user.response.dto';
import { LessonResponseDto } from './lesson.respons.dto';

export class CourseResponseDto {
  @ApiProperty({
    example: 'id',
  })
  id: string;

  @ApiProperty({
    example: 'title',
  })
  title: string;

  @ApiProperty({
    example: 'description',
  })
  description: string;

  @ApiProperty({
    example: 'level',
  })
  level: string;

  @ApiProperty({
    example: 'price',
  })
  price: number;

  @ApiProperty({
    example: 'isPublished',
  })
  isPublished: boolean;

  @ApiProperty({
    example: 'coverImageUrl',
  })
  coverImageUrl: string | null;

  @ApiProperty({
    example: '2026-01-19T23:25:09.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    example: '2026-01-19T23:25:09.000Z',
  })
  updatedAt?: Date;

  @ApiProperty({ type: UserResponseDto })
  instructor?: UserResponseDto;

  @ApiProperty({ type: [LessonResponseDto] })
  lessons?: LessonResponseDto[];

  constructor(course: Partial<CourseResponseDto>) {
    this.id = course.id || this.id;
    this.title = course.title || this.title;
    this.description = course.description || this.description;
    this.level = course.level || this.level;
    this.price = course.price || this.price;
    this.isPublished = course.isPublished || this.isPublished;
    this.coverImageUrl = course.coverImageUrl || this.coverImageUrl;
    this.createdAt = course.createdAt || this.createdAt;
    this.updatedAt = course.updatedAt || this.updatedAt;
    this.instructor = course.instructor || this.instructor;
    this.lessons = course.lessons || this.lessons;
  }
}
