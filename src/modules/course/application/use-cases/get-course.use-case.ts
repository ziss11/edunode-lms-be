import { Inject } from '@nestjs/common';
import { NotFoundException } from '../../../../common/exceptions';
import { UserResponseDto } from '../../../user/application/dto/user.response.dto';
import type { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { CourseResponseDto } from '../dto/course.response.dto';
import { LessonResponseDto } from '../dto/lesson.respons.dto';

export class GetCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(id: string): Promise<CourseResponseDto> {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new NotFoundException('Course not found');

    return new CourseResponseDto({
      ...course,
      instructor: course.instructor
        ? new UserResponseDto(course.instructor)
        : undefined,
      lessons: (course.lessons || []).map(
        (lesson) => new LessonResponseDto(lesson),
      ),
    });
  }
}
