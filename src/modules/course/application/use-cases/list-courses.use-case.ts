import { Inject } from '@nestjs/common';
import { UserResponseDto } from '../../../user/application/dto/user.response.dto';
import type { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { CourseResponseDto } from '../dto/course.response.dto';
import { LessonResponseDto } from '../dto/lesson.respons.dto';
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
      courses: result.courses.map(
        (course) =>
          new CourseResponseDto({
            ...course,
            instructor: course.instructor
              ? new UserResponseDto(course.instructor)
              : undefined,
            lessons: (course.lessons || []).map(
              (lesson) => new LessonResponseDto(lesson),
            ),
          }),
      ),
      total: result.total,
    };
  }
}
