import { Inject } from '@nestjs/common';
import { NotFoundException } from '../../../../common/exceptions';
import type { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { CourseEventPublisher } from '../../infrastructure/messaging/publishers/course-event.publisher';

export class PublishCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
    private readonly courseEventPublisher: CourseEventPublisher,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.courseRepository.findById(id);
    if (!exists) throw new NotFoundException('Course not found');

    exists.publish();

    const updated = await this.courseRepository.update(id, exists);
    this.courseEventPublisher.publishCoursePublished({
      courseId: updated.id,
      instructorId: updated.instructorId,
      title: updated.title,
      timestamp: new Date(),
    });
  }
}
