import { Inject, Injectable } from '@nestjs/common';
import { IEnrollmentRepository } from '../../domain/repositories/enrollment.repository.interface';
import { EnrollmentEventPublisher } from '../../infrastructure/messaging/publishers/enrollment-event.publisher';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';

@Injectable()
export class UpdateProgressUseCase {
  constructor(
    @Inject('IEnrollmentRepository')
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly enrollmentEventPublisher: EnrollmentEventPublisher,
  ) {}

  async execute(id: string, progress: number): Promise<EnrollmentResponseDto> {
    const updated = await this.enrollmentRepository.updateProgress(
      id,
      progress,
    );
    if (progress === 100) {
      this.enrollmentEventPublisher.publishCourseCompleted({
        id: updated.id,
        courseId: updated.courseId,
        studentId: updated.studentId,
        completedAt: updated.completedAt || new Date(),
      });
    }
    return new EnrollmentResponseDto(updated);
  }
}
