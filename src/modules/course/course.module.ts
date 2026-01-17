import { Module } from '@nestjs/common';

import { CourseEventPublisher } from './infrastructure/messaging/publishers/course-event.publisher';

@Module({
  providers: [CourseEventPublisher],
  exports: [CourseEventPublisher],
})
export class CourseModule {}
