import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EnrollmentEntity } from '../../domain/entities/enrollment.entity';
import type { IEnrollmentRepository } from '../../domain/repositories/enrollment.repository.interface';
import { EnrollCourseDto } from '../dto/enroll-course.dto';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';

@Injectable()
export class EnrollCourseUseCase {
  constructor(
    @Inject('IEnrollmentRepository')
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(dto: EnrollCourseDto): Promise<EnrollmentResponseDto> {
    const enrollment = new EnrollmentEntity(
      randomUUID(),
      dto.courseId,
      dto.studentId,
      new Date(),
      0,
      null,
    );
    const result = await this.enrollmentRepository.enroll(enrollment);
    return new EnrollmentResponseDto(result);
  }
}
