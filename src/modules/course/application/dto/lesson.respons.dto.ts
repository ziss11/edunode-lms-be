import { ApiProperty } from '@nestjs/swagger';

export class LessonResponseDto {
  @ApiProperty({
    example: 'id',
  })
  id: string;

  @ApiProperty({
    example: 'title',
  })
  title: string;

  @ApiProperty({
    example: 'content',
  })
  content: string;

  @ApiProperty({
    example: 'videoUrl',
  })
  videoUrl: string;

  @ApiProperty({
    example: 'duration',
  })
  duration: number;

  @ApiProperty({
    example: 'order',
  })
  order: number;

  @ApiProperty({
    example: true,
  })
  isFreePreview: boolean;

  @ApiProperty({
    example: '2026-01-19T23:25:09.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    example: '2026-01-19T23:25:09.000Z',
  })
  updatedAt?: Date;

  constructor(lesson: Partial<LessonResponseDto>) {
    this.id = lesson.id || this.id;
    this.title = lesson.title || this.title;
    this.content = lesson.content || this.content;
    this.videoUrl = lesson.videoUrl || this.videoUrl;
    this.duration = lesson.duration || this.duration;
    this.order = lesson.order || this.order;
    this.isFreePreview = lesson.isFreePreview || this.isFreePreview;
    this.createdAt = lesson.createdAt || this.createdAt;
    this.updatedAt = lesson.updatedAt || this.updatedAt;
  }
}
