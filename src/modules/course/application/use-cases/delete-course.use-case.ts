import { Inject } from '@nestjs/common';
import type { ICourseRepository } from '../../domain/repositories/course.repository.interface';

export class DeleteCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.courseRepository.delete(id);
  }
}
