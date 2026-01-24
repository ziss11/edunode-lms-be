import { Inject } from '@nestjs/common';
import { NotFoundException } from '../../../../common/exceptions/not-found.exception';
import { UserResponseDto } from '../../../user/application/dto/user.response.dto';
import type { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { CourseEventPublisher } from '../../infrastructure/messaging/publishers/course-event.publisher';
import { CourseResponseDto } from '../dto/course.response.dto';
import { LessonResponseDto } from '../dto/lesson.respons.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';

export class UpdateCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
    private readonly courseEventPublisher: CourseEventPublisher,
  ) {}

  async execute(id: string, dto: UpdateCourseDto): Promise<CourseResponseDto> {
    const exists = await this.courseRepository.findById(id);
    if (!exists) throw new NotFoundException('Course not found');

    exists.update(
      dto.title || exists.title,
      dto.description || exists.description,
      dto.level || exists.level,
      dto.price || exists.price,
      dto.coverImageUrl || exists.coverImageUrl,
    );

    const updated = await this.courseRepository.update(id, exists);
    this.courseEventPublisher.publishCourseUpdated({
      courseId: updated.id,
      changes: {
        title: dto.title,
        description: dto.description,
        level: dto.level,
        price: dto.price,
        coverImageUrl: dto.coverImageUrl,
      },
      timestamp: new Date(),
    });

    return new CourseResponseDto({
      ...updated,
      instructor: updated.instructor
        ? new UserResponseDto(updated.instructor)
        : undefined,
      lessons: (updated.lessons || []).map(
        (lesson) => new LessonResponseDto(lesson),
      ),
    });
  }
}
