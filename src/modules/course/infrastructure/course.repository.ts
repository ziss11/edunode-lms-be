import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../generated/prisma/client';
import { CoursesWhereInput } from '../../../../generated/prisma/models';
import { PRISMA_ORM } from '../../../shared/database/postgres/prisma.module';
import { CourseEntity } from '../domain/entities/course.entity';
import {
  CourseFindAllOptions,
  ICourseRepository,
} from '../domain/repositories/course.repository.interface';
import { CourseCacheService } from './cache/course-cache.service';
import { CourseMapper } from './persistence/mappers/course.mapper';

@Injectable()
export class CourseRepository implements ICourseRepository {
  constructor(
    @Inject(PRISMA_ORM) private readonly db: PrismaClient,
    private readonly courseCacheService: CourseCacheService,
  ) {}

  async create(course: CourseEntity): Promise<CourseEntity> {
    const data = CourseMapper.toPayload(course);
    const created = await this.db.courses.create({ data });
    return CourseMapper.toDomain(created);
  }

  async findById(id: string): Promise<CourseEntity | null> {
    const course = await this.db.courses.findUnique({ where: { id } });
    return course ? CourseMapper.toDomain(course) : null;
  }

  async findAll(
    options: CourseFindAllOptions,
  ): Promise<{ courses: CourseEntity[]; total: number }> {
    const { page = 1, limit = 10, orderBy, orderDirection, filters } = options;
    const offset = (page - 1) * limit;

    const conditions: CoursesWhereInput = {};

    if (filters?.instructorId) {
      conditions.instructorId = filters.instructorId;
    }
    if (filters?.isPublished) {
      conditions.isPublished = filters.isPublished;
    }
    if (filters?.level) {
      conditions.level = filters.level;
    }
    if (filters?.price) {
      if (filters?.price?.max) {
        conditions.price = {
          lte: filters?.price?.max,
        };
      }
      if (filters?.price?.min) {
        conditions.price = {
          gte: filters?.price.min,
        };
      }
    }
    if (filters?.search) {
      conditions.AND = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    const [courseRows, count] = await this.db.$transaction([
      this.db.courses.findMany({
        take: limit,
        skip: offset,
        where: conditions,
        orderBy: {
          [orderBy as string]: orderDirection,
        },
      }),
      this.db.courses.count({ where: conditions }),
    ]);
    return {
      courses: courseRows.map((user) => CourseMapper.toDomain(user)),
      total: count,
    };
  }

  async update(id: string, course: CourseEntity): Promise<CourseEntity | null> {
    const dto = CourseMapper.toPayload(course);
    const updated = await this.db.courses.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() },
    });
    return updated ? CourseMapper.toDomain(updated) : null;
  }

  async delete(id: string): Promise<void> {
    await this.db.courses.delete({ where: { id } });
  }
}
