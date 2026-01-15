import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from './course.response.dto';

export class LessonResponseDto {
  @ApiProperty({
    example: 'Lesson ID',
  })
  id: string;

  @ApiProperty({
    example: 'Lesson Title',
  })
  title: string;

  @ApiProperty({
    example: 'Lesson Description',
  })
  description: string;

  @ApiProperty({
    example: 'Lesson Content',
  })
  content: string;

  @ApiProperty({
    example: 'Lesson Video URL',
  })
  videoUrl: string;

  @ApiProperty({
    example: 'Lesson Duration',
  })
  duration: number;

  @ApiProperty({
    example: 'Lesson Order',
  })
  order: number;

  @ApiProperty({
    example: 'Lesson Is Free Preview',
  })
  isFreePreview: boolean;

  @ApiProperty({
    example: 'Lesson Created At',
  })
  createdAt?: Date;

  @ApiProperty({
    example: 'Lesson Updated At',
  })
  updatedAt?: Date;

  @ApiProperty({ type: CourseResponseDto })
  course?: CourseResponseDto;

  constructor(lesson: Partial<LessonResponseDto>) {
    this.id = lesson.id || this.id;
    this.title = lesson.title || this.title;
    this.description = lesson.description || this.description;
    this.content = lesson.content || this.content;
    this.videoUrl = lesson.videoUrl || this.videoUrl;
    this.duration = lesson.duration || this.duration;
    this.order = lesson.order || this.order;
    this.isFreePreview = lesson.isFreePreview || this.isFreePreview;
    this.createdAt = lesson.createdAt || this.createdAt;
    this.updatedAt = lesson.updatedAt || this.updatedAt;
    this.course = lesson.course || this.course;
  }
}
