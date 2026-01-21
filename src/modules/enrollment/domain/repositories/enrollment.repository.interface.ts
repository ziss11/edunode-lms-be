import { EnrollmentEntity } from '../entities/enrollment.entity';

export interface IEnrollmentRepository {
  enroll(enrollment: EnrollmentEntity): Promise<EnrollmentEntity>;
  get(id: string): Promise<EnrollmentEntity | null>;
  findAll(
    userId: string,
  ): Promise<{ enrollments: EnrollmentEntity[]; total: number }>;
  updateProgress(id: string, progress: number): Promise<EnrollmentEntity>;
}
