import { Inject, Injectable } from '@nestjs/common';
import { IEnrollmentRepository } from '../../domain/repositories/enrollment.repository.interface';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';

@Injectable()
export class GetEnrollmentUseCase {
  constructor(
    @Inject('IEnrollmentRepository')
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(id: string): Promise<EnrollmentResponseDto | null> {
    const enrollment = await this.enrollmentRepository.get(id);
    return enrollment ? new EnrollmentResponseDto(enrollment) : null;
  }
}
