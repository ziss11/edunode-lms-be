import { Inject } from '@nestjs/common';
import { NotFoundException } from '../../../../common/exceptions/not-found.exception';
import type { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { Price } from '../../domain/value-objects/price.vo';
import { CourseResponseDto } from '../dto/course.response.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';

export class UpdateCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateCourseDto,
  ): Promise<CourseResponseDto | null> {
    const exists = await this.courseRepository.findById(id);
    if (!exists) {
      throw new NotFoundException('Course not found');
    }

    exists.update(
      dto.title || exists.title,
      dto.description || exists.description,
      dto.level || exists.level,
      new Price(dto.price || exists.price.getAmount()),
      dto.coverImageUrl || exists.coverImageUrl,
    );

    const result = await this.courseRepository.update(id, exists);
    return new CourseResponseDto({
      ...result,
      price: result?.price?.getAmount(),
    });
  }
}
