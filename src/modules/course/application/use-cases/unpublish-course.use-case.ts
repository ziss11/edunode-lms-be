import { Inject } from '@nestjs/common';
import { NotFoundException } from '../../../../common/exceptions';
import type { ICourseRepository } from '../../domain/repositories/course.repository.interface';

export class UnpublishCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.courseRepository.findById(id);
    if (!exists) throw new NotFoundException('Course not found');

    exists.unpublish();
    await this.courseRepository.update(id, exists);
  }
}
