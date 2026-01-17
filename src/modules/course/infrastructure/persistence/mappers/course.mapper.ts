import { CourseEntity } from '../../../domain/entities/course.entity';
import { CourseLevel } from '../../../domain/enums/course-level.enum';
import { Price } from '../../../domain/value-objects/price.vo';
import type { CourseRow } from '../schema/course.schema';

export class CourseMapper {
  static toDomain(row: CourseRow): CourseEntity {
    return new CourseEntity(
      row.id,
      row.instructorId,
      row.title,
      new Price(row.price),
      row.level as CourseLevel,
      row.instructorId,
      row.isPublished,
      row.coverImageUrl,
      row.createdAt,
      row.updatedAt,
    );
  }

  static toPersistence(entity: CourseEntity): CourseRow {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      price: entity.price.getAmount(),
      level: entity.level,
      instructorId: entity.instructorId,
      isPublished: entity.isPublished,
      coverImageUrl: entity.coverImageUrl,
      createdAt: entity.createdAt ? new Date(entity.createdAt) : new Date(),
      updatedAt: entity.updatedAt ? new Date(entity.updatedAt) : new Date(),
    };
  }
}
