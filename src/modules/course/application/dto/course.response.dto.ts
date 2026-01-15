import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../user/application/dto/user.response.dto';

export class CourseResponseDto {
  @ApiProperty({
    example: 'Course ID',
  })
  id: string;

  @ApiProperty({
    example: 'Course Title',
  })
  title: string;

  @ApiProperty({
    example: 'Course Description',
  })
  description: string;

  @ApiProperty({
    example: 'Course Level',
  })
  level: string;

  @ApiProperty({
    example: 'Course Price',
  })
  price: number;

  @ApiProperty({
    example: 'Course Is Published',
  })
  isPublished: boolean;

  @ApiProperty({
    example: 'Course Cover Image URL',
  })
  coverImageUrl?: string;

  @ApiProperty({
    example: 'Course Created At',
  })
  createdAt?: Date;

  @ApiProperty({
    example: 'Course Updated At',
  })
  updatedAt?: Date;

  @ApiProperty({ type: UserResponseDto })
  instructor: UserResponseDto;

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
  }
}
