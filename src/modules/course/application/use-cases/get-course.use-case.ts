import { Inject } from '@nestjs/common';
import { NotFoundException } from '../../../../common/exceptions';
import type { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { CourseResponseDto } from '../dto/course.response.dto';

export class GetCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(id: string): Promise<CourseResponseDto | null> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return new CourseResponseDto({
      ...course,
      price: course.price.getAmount(),
    });
  }
}
