import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../generated/prisma/client';
import { PRISMA_ORM } from '../../../shared/database/postgres/prisma.module';
import { LessonEntity } from '../domain/entities/lesson.entity';
import { ILessonRepository } from '../domain/repositories/lesson.repository.interface';
import { LessonMapper } from './persistence/mappers/lesson.mapper';

@Injectable()
export class LessonRepository implements ILessonRepository {
  constructor(@Inject(PRISMA_ORM) private readonly db: PrismaClient) {}

  async create(lesson: LessonEntity): Promise<LessonEntity> {
    const data = LessonMapper.toPayload(lesson);
    const created = await this.db.lessons.create({
      data,
      include: { course: true },
    });
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
    return LessonMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.db.lessons.delete({ where: { id } });
  }
}
