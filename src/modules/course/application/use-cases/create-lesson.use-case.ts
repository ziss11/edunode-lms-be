import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LessonEntity } from '../../domain/entities/lesson.entity';
import type { ILessonRepository } from '../../domain/repositories/lesson.repository.interface';
import { Duration } from '../../domain/value-objects/duration.vo';
import { LessonMapper } from '../../infrastructure/persistence/mappers/lesson.mapper';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { LessonResponseDto } from '../dto/lesson.respons.dto';

export class CreateLessonUseCase {
  constructor(
    @Inject('ILessonRepository')
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(dto: CreateLessonDto): Promise<LessonResponseDto> {
    const lesson = new LessonEntity(
      randomUUID(),
      dto.courseId,
      dto.title,
      dto.description,
      dto.videoUrl,
      new Duration(dto.duration),
      dto.order,
      dto.isFreePreview,
    );
    const result = await this.lessonRepository.create(lesson);
    return LessonMapper.toResponse(result);
  }
}
