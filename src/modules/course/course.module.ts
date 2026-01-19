import { Module } from '@nestjs/common';

import { CreateCourseUseCase } from './application/use-cases/create-course.use-case';
import { CreateLessonUseCase } from './application/use-cases/create-lesson.use-case';
import { DeleteCourseUseCase } from './application/use-cases/delete-course.use-case';
import { DeleteLessonUseCase } from './application/use-cases/delete-lesson.use-case';
import { GetCourseUseCase } from './application/use-cases/get-course.use-case';
import { ListCoursesUseCase } from './application/use-cases/list-courses.use-case';
import { PublishCourseUseCase } from './application/use-cases/publish-course.use-case';
import { UnpublishCourseUseCase } from './application/use-cases/unpublish-course.use-case';
import { UpdateCourseUseCase } from './application/use-cases/update-course.use-case';
import { UpdateLessonUseCase } from './application/use-cases/update-lesson.use-case';
import { CourseCacheService } from './infrastructure/cache/course-cache.service';
import { CourseRepository } from './infrastructure/course.repository';
import { LessonRepository } from './infrastructure/lesson.repository';
import { CourseEventPublisher } from './infrastructure/messaging/publishers/course-event.publisher';
import { CourseController } from './interface/course.controller';
import { LessonController } from './interface/lesson.controller';

@Module({
  controllers: [CourseController, LessonController],
  providers: [
    CreateCourseUseCase,
    GetCourseUseCase,
    ListCoursesUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
    PublishCourseUseCase,
    UnpublishCourseUseCase,
    CreateLessonUseCase,
    UpdateLessonUseCase,
    DeleteLessonUseCase,
    {
      provide: 'ICourseRepository',
      useClass: CourseRepository,
    },
    {
      provide: 'ILessonRepository',
      useClass: LessonRepository,
    },
    CourseEventPublisher,
    CourseCacheService,
  ],
  exports: ['ICourseRepository', 'ILessonRepository', CourseCacheService],
})
export class CourseModule {}
