import { Inject, NotFoundException } from '@nestjs/common';
import type { ICourseRepository } from '../../domain/repositories/course.repository.interface';

export class DeleteCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.courseRepository.findById(id);
    if (!exists) throw new NotFoundException('Course not found');

    await this.courseRepository.delete(id);
  }
}
