import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CourseEntity } from '../../domain/entities/course.entity';
import type { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { Price } from '../../domain/value-objects/price.vo';
import { CreateCourseDto } from '../dto/create-course.dto';

export class CreateCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(dto: CreateCourseDto): Promise<CourseEntity> {
    const course = new CourseEntity(
      randomUUID(),
      dto.title,
      dto.description,
      new Price(dto.price),
      dto.level,
      dto.instructorId,
      dto.isPublished,
      dto.coverImageUrl,
      new Date(),
      new Date(),
    );
    return await this.courseRepository.create(course);
  }
}
