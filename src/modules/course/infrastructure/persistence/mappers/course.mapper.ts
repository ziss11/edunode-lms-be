import { Courses } from '../../../../../../generated/prisma/client';
import { CoursesCreateInput } from '../../../../../../generated/prisma/models';
import { UserMapper } from '../../../../user/infrastructure/persistence/mappers/user.mapper';
import { CourseResponseDto } from '../../../application/dto/course.response.dto';
import { CourseEntity } from '../../../domain/entities/course.entity';
import { CourseLevel } from '../../../domain/enums/course-level.enum';
import { LessonMapper } from './lesson.mapper';

export class CourseMapper {
  static toDomain(row: Courses): CourseEntity {
    return new CourseEntity(
      row.id,
      row.instructorId,
      row.title,
      row.price,
      row.level as CourseLevel,
      row.instructorId,
      row.isPublished,
      row.coverImageUrl,
      row.createdAt,
      row.updatedAt,
    );
  }

  static toResponse(entity: CourseEntity): CourseResponseDto {
    return new CourseResponseDto({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      price: entity.price,
      level: entity.level,
      isPublished: entity.isPublished,
      coverImageUrl: entity.coverImageUrl,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      instructor: entity.instructor
        ? UserMapper.toResponse(entity.instructor)
        : undefined,
      lessons: (entity.lessons || []).map((lesson) =>
        LessonMapper.toResponse(lesson),
      ),
    });
  }

  static toPayload(entity: CourseEntity): CoursesCreateInput {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      price: entity.price,
      level: entity.level,
      isPublished: entity.isPublished,
      coverImageUrl: entity.coverImageUrl,
      createdAt: entity.createdAt || new Date(),
      updatedAt: entity.updatedAt || new Date(),
      instructor: {
        connect: {
          id: entity.instructorId,
        },
      },
    };
  }
}
