import { Inject, Injectable } from '@nestjs/common';
import { IEnrollmentRepository } from '../../domain/repositories/enrollment.repository.interface';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';

@Injectable()
export class ListMyEnrollmentsUseCase {
  constructor(
    @Inject('IEnrollmentRepository')
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(
    userId: string,
  ): Promise<{ enrollments: EnrollmentResponseDto[]; total: number }> {
    const { enrollments, total } =
      await this.enrollmentRepository.findAll(userId);
    return {
      enrollments: enrollments.map(
        (enrollment) => new EnrollmentResponseDto(enrollment),
      ),
      total,
    };
  }
}
