import { Inject } from '@nestjs/common';
import type { ILessonRepository } from '../../domain/repositories/lesson.repository.interface';
import { Duration } from '../../domain/value-objects/duration.vo';
import { LessonResponseDto } from '../dto/lesson.respons.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';

export class AddLessonUseCase {
  constructor(
    @Inject('ILessonRepository')
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(
    id: string,
    lesson: UpdateLessonDto,
  ): Promise<LessonResponseDto | null> {
    const exists = await this.lessonRepository.findById(id);
    if (!exists) {
      return null;
    }

    exists.updateContent(
      lesson.title || exists.title,
      lesson.content || exists.content,
    );

    if (lesson.order) {
      exists.reorder(lesson.order);
    }

    if (lesson.isFreePreview) {
      exists.toggleFreePreview();
    }

    if (lesson.videoUrl) {
      exists.changeVideo(lesson.videoUrl, new Duration(lesson.duration || 0));
    }

    const response = await this.lessonRepository.update(id, exists);
    return new LessonResponseDto({
      ...response,
      duration: response?.duration?.getMinutes(),
    });
  }
}
