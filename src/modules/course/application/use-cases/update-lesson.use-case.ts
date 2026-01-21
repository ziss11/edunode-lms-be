import { Inject, NotFoundException } from '@nestjs/common';
import type { ILessonRepository } from '../../domain/repositories/lesson.repository.interface';
import { LessonResponseDto } from '../dto/lesson.respons.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';

export class UpdateLessonUseCase {
  constructor(
    @Inject('ILessonRepository')
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(id: string, dto: UpdateLessonDto): Promise<LessonResponseDto> {
    const exists = await this.lessonRepository.findById(id);
    if (!exists) throw new NotFoundException('Lesson not found');

    exists.updateContent(
      dto.title || exists.title,
      dto.content || exists.content,
    );

    if (dto.order) exists.reorder(dto.order);
    if (dto.isFreePreview) exists.toggleFreePreview();
    if (dto.videoUrl) {
      exists.changeVideo(dto.videoUrl, dto.duration || exists.duration);
    }

    const updated = await this.lessonRepository.update(id, exists);
    return new LessonResponseDto(updated);
  }
}
