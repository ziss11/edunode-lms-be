import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NotFoundException } from '../../../../common/exceptions/not-found.exception';
import { LessonEntity } from '../../domain/entities/lesson.entity';
import { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import type { ILessonRepository } from '../../domain/repositories/lesson.repository.interface';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { LessonResponseDto } from '../dto/lesson.respons.dto';

export class CreateLessonUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
    @Inject('ILessonRepository')
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(dto: CreateLessonDto): Promise<LessonResponseDto> {
    const course = await this.courseRepository.findById(dto.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const lesson = new LessonEntity(
      randomUUID(),
      dto.courseId,
      dto.title,
      dto.description,
      dto.videoUrl,
      dto.duration,
      dto.order,
      dto.isFreePreview,
    );
    const result = await this.lessonRepository.create(lesson);
    return new LessonResponseDto(result);
  }
}
