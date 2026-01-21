import { Inject, Injectable } from '@nestjs/common';
import { IEnrollmentRepository } from '../../domain/repositories/enrollment.repository.interface';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';

@Injectable()
export class UpdateProgressUseCase {
  constructor(
    @Inject('IEnrollmentRepository')
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(id: string, progress: number): Promise<EnrollmentResponseDto> {
    const enrollment = await this.enrollmentRepository.updateProgress(
      id,
      progress,
    );
    return new EnrollmentResponseDto(enrollment);
  }
}
