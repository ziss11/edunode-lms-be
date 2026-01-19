import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ILessonRepository } from '../../domain/repositories/lesson.repository.interface';

@Injectable()
export class DeleteLessonUseCase {
  constructor(
    @Inject('ILessonRepository')
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.lessonRepository.findById(id);
    if (!exists) throw new NotFoundException('Lesson not found');

    await this.lessonRepository.delete(id);
  }
}
