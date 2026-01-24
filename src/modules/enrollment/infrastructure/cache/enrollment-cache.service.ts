import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../../shared/database/redis/redis.service';
import { EnrollmentEntity } from '../../domain/entities/enrollment.entity';

@Injectable()
export class EnrollmentCacheService {
  private readonly TTL_DETAIL = 3600;
  private readonly TTL_LIST = 300;

  private readonly PREFIX = 'enrollments:';
  private readonly VERSION_KEY = `${this.PREFIX}version`;

  constructor(private readonly redisService: RedisService) {}

  private async getVersion(): Promise<string> {
    const v = await this.redisService.get<number>(this.VERSION_KEY);
    return v ? `v${v}` : 'v0';
  }

  private async generateListKey(userId: string): Promise<string> {
    const version = await this.getVersion();
    return `${this.PREFIX}list:${userId}:${version}`;
  }

  async get(id: string): Promise<EnrollmentEntity | null> {
    const result = await this.redisService.get<EnrollmentEntity>(
      `${this.PREFIX}${id}`,
    );
    return result;
  }

  async set(id: string, enrollment: EnrollmentEntity): Promise<void> {
    await this.redisService.set(
      `${this.PREFIX}${id}`,
      enrollment,
      this.TTL_DETAIL,
    );
  }

  async delete(id: string): Promise<void> {
    await this.redisService.del(`${this.PREFIX}${id}`);
  }

  async invalidateListCache(): Promise<void> {
    await this.redisService.increment(this.VERSION_KEY);
  }

  async list(userId: string): Promise<{
    enrollments: EnrollmentEntity[];
    total: number;
  } | null> {
    const key = await this.generateListKey(userId);
    return await this.redisService.get(key);
  }

  async setList(
    userId: string,
    result: {
      enrollments: EnrollmentEntity[];
      total: number;
    },
  ): Promise<void> {
    const key = await this.generateListKey(userId);
    await this.redisService.set(key, result, this.TTL_LIST);
  }
}
