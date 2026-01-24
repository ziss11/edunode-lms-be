import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../../../../../shared/messaging/rabbitmq/rabbitmq.service';
import { CourseCompletedEvent } from '../../../application/events/course-completed.event';
import { CourseEnrolledEvent } from '../../../application/events/course-enrolled.event';

@Injectable()
export class EnrollmentEventPublisher {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  publishCourseEnrolled(event: CourseEnrolledEvent): void {
    const routingKey = 'course.enrolled';
    this.rabbitMQService.publish(routingKey, event);
  }

  publishCourseCompleted(event: CourseCompletedEvent): void {
    const routingKey = 'course.completed';
    this.rabbitMQService.publish(routingKey, event);
  }
}
