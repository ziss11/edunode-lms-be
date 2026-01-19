import { Lessons } from '../../../../../../generated/prisma/browser';
import { LessonsCreateInput } from '../../../../../../generated/prisma/models';
import { LessonResponseDto } from '../../../application/dto/lesson.respons.dto';
import { LessonEntity } from '../../../domain/entities/lesson.entity';
import { Duration } from '../../../domain/value-objects/duration.vo';

export class LessonMapper {
  static toDomain(row: Lessons): LessonEntity {
    return new LessonEntity(
      row.id,
      row.title,
      row.courseId,
      row.content,
      row.videoUrl,
      new Duration(row.duration),
      row.order,
      row.isFreePreview,
      row.createdAt,
      row.updatedAt,
    );
  }

  static toResponse(entity: LessonEntity): LessonResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      content: entity.content,
      videoUrl: entity.videoUrl,
      duration: entity.duration.getMinutes(),
      order: entity.order,
      isFreePreview: entity.isFreePreview,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toPayload(entity: LessonEntity): LessonsCreateInput {
    return {
      id: entity.id,
      title: entity.title,
      content: entity.content,
      videoUrl: entity.videoUrl,
      duration: entity.duration.getMinutes(),
      order: entity.order,
      isFreePreview: entity.isFreePreview,
      createdAt: entity.createdAt || new Date(),
      updatedAt: entity.updatedAt || new Date(),
      course: {
        connect: {
          id: entity.courseId,
        },
      },
    };
  }
}
