import { Inject } from '@nestjs/common';
import type { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { CourseMapper } from '../../infrastructure/persistence/mappers/course.mapper';
import { CourseResponseDto } from '../dto/course.response.dto';
import { ListCoursesQueryDto } from '../dto/queries/list-courses.query.dto';

export class ListCoursesUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    queries: ListCoursesQueryDto,
  ): Promise<{ courses: CourseResponseDto[]; total: number }> {
    const result = await this.courseRepository.findAll({
      page: queries.page,
      limit: queries.limit,
      orderBy: queries.orderBy,
      orderDirection: queries.orderDirection,
      filters: {
        search: queries.search,
        instructorId: queries.instructorId,
        isPublished: queries.isPublished,
        level: queries.level,
        price: {
          min: queries.minPrice,
          max: queries.maxPrice,
        },
      },
    });
    return {
      courses: result.courses.map((course) => CourseMapper.toResponse(course)),
      total: result.total,
    };
  }
}
