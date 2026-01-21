import { Lessons } from '../../../../../../generated/prisma/browser';
import { LessonsCreateInput } from '../../../../../../generated/prisma/models';
import { LessonEntity } from '../../../domain/entities/lesson.entity';

export class LessonMapper {
  static toDomain(row: Lessons): LessonEntity {
    return new LessonEntity(
      row.id,
      row.title,
      row.courseId,
      row.content,
      row.videoUrl,
      row.duration,
      row.order,
      row.isFreePreview,
      row.createdAt,
      row.updatedAt,
    );
  }

  static toPayload(entity: LessonEntity): LessonsCreateInput {
    return {
      id: entity.id,
      title: entity.title,
      content: entity.content,
      videoUrl: entity.videoUrl,
      duration: entity.duration,
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
