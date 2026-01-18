import { LessonResponseDto } from '../../../application/dto/lesson.respons.dto';
import { LessonEntity } from '../../../domain/entities/lesson.entity';

export class LessonMapper {
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
}
