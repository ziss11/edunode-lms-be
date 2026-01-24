import { Module } from '@nestjs/common';
import { CourseModule } from '../course/course.module';
import { UserModule } from '../user/user.module';
import { EnrollCourseUseCase } from './application/use-cases/enroll-course.use-case';
import { GetEnrollmentUseCase } from './application/use-cases/get-enrollment.use-case';
import { ListMyEnrollmentsUseCase } from './application/use-cases/list-my-enrollments.use-case';
import { UpdateProgressUseCase } from './application/use-cases/update-progress.use-case';
import { EnrollmentCacheService } from './infrastructure/cache/enrollment-cache.service';
import { EnrollmentRepository } from './infrastructure/enrollment.repository';
import { EnrollmentEventPublisher } from './infrastructure/messaging/publishers/enrollment-event.publisher';
import { EnrollmentController } from './interface/enrollment.controller';

@Module({
  imports: [UserModule, CourseModule],
  controllers: [EnrollmentController],
  providers: [
    EnrollCourseUseCase,
    GetEnrollmentUseCase,
    ListMyEnrollmentsUseCase,
    UpdateProgressUseCase,
    {
      provide: 'IEnrollmentRepository',
      useClass: EnrollmentRepository,
    },
    EnrollmentEventPublisher,
    EnrollmentCacheService,
  ],
  exports: ['IEnrollmentRepository', EnrollmentCacheService],
})
export class EnrollmentModule {}
