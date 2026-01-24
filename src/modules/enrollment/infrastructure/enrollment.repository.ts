import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../generated/prisma/client';
import { PRISMA_ORM } from '../../../shared/database/postgres/prisma.module';
import { EnrollmentEntity } from '../domain/entities/enrollment.entity';
import { IEnrollmentRepository } from '../domain/repositories/enrollment.repository.interface';
import { EnrollmentCacheService } from './cache/enrollment-cache.service';
import { EnrollmentMapper } from './persistence/mappers/enrollment.mapper';

@Injectable()
export class EnrollmentRepository implements IEnrollmentRepository {
  constructor(
    @Inject(PRISMA_ORM) private readonly db: PrismaClient,
    private readonly enrollmentCacheService: EnrollmentCacheService,
  ) {}

  async enroll(enrollment: EnrollmentEntity): Promise<EnrollmentEntity> {
    const data = EnrollmentMapper.toPayload(enrollment);
    const created = await this.db.enrollments.create({
      data,
      include: {
        student: true,
        course: true,
      },
    });

    const result = EnrollmentMapper.toDomain(created);
    await this.enrollmentCacheService.set(result.id, result);
    await this.enrollmentCacheService.invalidateListCache();

    return result;
  }

  async get(id: string): Promise<EnrollmentEntity | null> {
    const cache = await this.enrollmentCacheService.get(id);
    if (cache) return cache;

    const enrollment = await this.db.enrollments.findUnique({
      where: { id },
      include: {
        student: true,
        course: true,
      },
    });
    const result = enrollment ? EnrollmentMapper.toDomain(enrollment) : null;
    if (result) await this.enrollmentCacheService.set(id, result);

    return result;
  }

  async findAll(
    userId: string,
  ): Promise<{ enrollments: EnrollmentEntity[]; total: number }> {
    const cache = await this.enrollmentCacheService.list(userId);
    if (cache) return cache;

    const enrollments = await this.db.enrollments.findMany({
      where: { studentId: userId },
      include: {
        student: true,
        course: true,
      },
    });
    const result = {
      enrollments: enrollments.map((enrollment) =>
        EnrollmentMapper.toDomain(enrollment),
      ),
      total: enrollments.length,
    };
    await this.enrollmentCacheService.setList(userId, result);

    return result;
  }

  async updateProgress(
    id: string,
    progress: number,
  ): Promise<EnrollmentEntity> {
    const updated = await this.db.enrollments.update({
      where: { id },
      data: {
        progress,
        completedAt: progress === 100 ? new Date() : null,
      },
      include: {
        student: true,
        course: true,
      },
    });

    const result = EnrollmentMapper.toDomain(updated);
    await this.enrollmentCacheService.set(id, result);
    await this.enrollmentCacheService.invalidateListCache();

    return result;
  }
}
