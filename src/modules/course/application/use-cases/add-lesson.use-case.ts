import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LessonEntity } from '../../domain/entities/lesson.entity';
import type { ILessonRepository } from '../../domain/repositories/lesson.repository.interface';
import { Duration } from '../../domain/value-objects/duration.vo';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { LessonResponseDto } from '../dto/lesson.respons.dto';

export class AddLessonUseCase {
  constructor(
    @Inject('ILessonRepository')
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(lesson: CreateLessonDto): Promise<LessonResponseDto> {
    const payload = new LessonEntity(
      randomUUID(),
      lesson.courseId,
      lesson.title,
      lesson.description,
      lesson.videoUrl,
      new Duration(lesson.duration),
      lesson.order,
      lesson.isFreePreview,
    );

    const response = await this.lessonRepository.create(payload);
    return new LessonResponseDto({
      ...response,
      duration: response?.duration?.getMinutes(),
    });
  }
}
