import { Enrollments } from '../../../../../../generated/prisma/browser';
import { EnrollmentsCreateInput } from '../../../../../../generated/prisma/models';
import { EnrollmentEntity } from '../../../domain/entities/enrollment.entity';

export class EnrollmentMapper {
  static toDomain(enrollment: Enrollments): EnrollmentEntity {
    return new EnrollmentEntity(
      enrollment.id,
      enrollment.courseId,
      enrollment.studentId,
      enrollment.enrolledAt,
      enrollment.progress,
      enrollment.completedAt,
    );
  }

  static toPayload(enrollment: EnrollmentEntity): EnrollmentsCreateInput {
    return {
      id: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      progress: enrollment.progress,
      completedAt: enrollment.completedAt,
      student: {
        connect: {
          id: enrollment.studentId,
        },
      },
      course: {
        connect: {
          id: enrollment.courseId,
        },
      },
    };
  }
}
