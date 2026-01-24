import { Inject, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BadRequestException } from '../../../../common/exceptions/bad-request.exception';
import { UserResponseDto } from '../../../user/application/dto/user.response.dto';
import { UserRole } from '../../../user/domain/enums/user-role.enum';
import { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import { CourseEntity } from '../../domain/entities/course.entity';
import type { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { CourseEventPublisher } from '../../infrastructure/messaging/publishers/course-event.publisher';
import { CourseResponseDto } from '../dto/course.response.dto';
import { CreateCourseDto } from '../dto/create-course.dto';
import { LessonResponseDto } from '../dto/lesson.respons.dto';

export class CreateCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly courseEventPublisher: CourseEventPublisher,
  ) {}

  async execute(dto: CreateCourseDto): Promise<CourseResponseDto> {
    const instructor = await this.userRepository.findById(dto.instructorId);
    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }
    if (instructor.role !== UserRole.INSTRUCTOR) {
      throw new BadRequestException('User is not an instructor');
    }

    const course = new CourseEntity(
      randomUUID(),
      dto.title,
      dto.description,
      dto.price,
      dto.level,
      dto.instructorId,
      dto.isPublished,
      dto.coverImageUrl,
      new Date(),
      new Date(),
    );
    const created = await this.courseRepository.create(course);
    this.courseEventPublisher.publishCourseCreated({
      courseId: created.id,
      instructorId: created.instructorId,
      title: created.title,
      price: created.price,
      timestamp: new Date(),
    });

    return new CourseResponseDto({
      ...created,
      instructor: created.instructor
        ? new UserResponseDto(created.instructor)
        : undefined,
      lessons: (created.lessons || []).map(
        (lesson) => new LessonResponseDto(lesson),
      ),
    });
  }
}
