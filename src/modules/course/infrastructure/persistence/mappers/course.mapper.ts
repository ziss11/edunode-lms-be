import { Courses } from '../../../../../../generated/prisma/client';
import { CoursesCreateInput } from '../../../../../../generated/prisma/models';
import { CourseEntity } from '../../../domain/entities/course.entity';
import { CourseLevel } from '../../../domain/enums/course-level.enum';

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
