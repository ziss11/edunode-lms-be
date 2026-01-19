import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../generated/prisma/client';
import { PRISMA_ORM } from '../../../shared/database/postgres/prisma.module';
import { LessonEntity } from '../domain/entities/lesson.entity';
import { ILessonRepository } from '../domain/repositories/lesson.repository.interface';
import { CourseCacheService } from './cache/course-cache.service';
import { CourseMapper } from './persistence/mappers/course.mapper';
import { LessonMapper } from './persistence/mappers/lesson.mapper';

@Injectable()
export class LessonRepository implements ILessonRepository {
  constructor(
    @Inject(PRISMA_ORM) private readonly db: PrismaClient,
    private readonly courseCacheService: CourseCacheService,
  ) {}

  async create(lesson: LessonEntity): Promise<LessonEntity> {
    const data = LessonMapper.toPayload(lesson);
    const created = await this.db.lessons.create({
      data,
      include: {
        course: {
          include: {
            instructor: true,
            lessons: true,
          },
        },
      },
    });

    const result = LessonMapper.toDomain(created);
    await this.courseCacheService.set(
      result.courseId,
      CourseMapper.toDomain(created.course),
    );

    return LessonMapper.toDomain(created);
  }

  async findById(id: string): Promise<LessonEntity | null> {
    const course = await this.db.lessons.findUnique({
      where: { id },
      include: { course: true },
    });
    return course ? LessonMapper.toDomain(course) : null;
  }

  async update(id: string, lesson: LessonEntity): Promise<LessonEntity> {
    const data = LessonMapper.toPayload(lesson);
    const updated = await this.db.lessons.update({
      where: { id },
      data,
      include: { course: true },
    });

    const result = LessonMapper.toDomain(updated);
    await this.courseCacheService.set(
      result.courseId,
      CourseMapper.toDomain(updated.course),
    );
    await this.courseCacheService.invalidateListCache();

    return result;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.db.lessons.delete({ where: { id } });
    await this.courseCacheService.delete(deleted.courseId);
    await this.courseCacheService.invalidateListCache();
  }
}
