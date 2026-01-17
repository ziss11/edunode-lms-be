import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../../../../../shared/messaging/rabbitmq/rabbitmq.service';
import { CourseCreatedEvent } from '../../../application/events/course-created.event';
import { CoursePublishedEvent } from '../../../application/events/course-published.event';
import { CourseUpdatedEvent } from '../../../application/events/course-updated.event';

@Injectable()
export class CourseEventPublisher {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  publishCourseCreated(event: CourseCreatedEvent): void {
    const routingKey = 'course.created';
    this.rabbitMQService.publish(routingKey, event);
  }

  publishCourseUpdated(event: CourseUpdatedEvent): void {
    const routingKey = 'course.updated';
    this.rabbitMQService.publish(routingKey, event);
  }

  publishCoursePublished(event: CoursePublishedEvent): void {
    const routingKey = 'course.published';
    this.rabbitMQService.publish(routingKey, event);
  }
}
