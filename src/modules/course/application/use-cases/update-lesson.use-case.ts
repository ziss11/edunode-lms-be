import { Inject } from '@nestjs/common';
import type { ILessonRepository } from '../../domain/repositories/lesson.repository.interface';
import { Duration } from '../../domain/value-objects/duration.vo';
import { LessonMapper } from '../../infrastructure/persistence/mappers/lesson.mapper';
import { LessonResponseDto } from '../dto/lesson.respons.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';

export class AddLessonUseCase {
  constructor(
    @Inject('ILessonRepository')
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateLessonDto,
  ): Promise<LessonResponseDto | null> {
    const exists = await this.lessonRepository.findById(id);
    if (!exists) {
      return null;
    }

    exists.updateContent(
      dto.title || exists.title,
      dto.content || exists.content,
    );

    if (dto.order) {
      exists.reorder(dto.order);
    }

    if (dto.isFreePreview) {
      exists.toggleFreePreview();
    }

    if (dto.videoUrl) {
      exists.changeVideo(dto.videoUrl, new Duration(dto.duration || 0));
    }

    const updated = await this.lessonRepository.update(id, exists);
    return updated ? LessonMapper.toResponse(updated) : null;
  }
}
