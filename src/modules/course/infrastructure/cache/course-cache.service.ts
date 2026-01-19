import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../../shared/database/redis/redis.service';
import { CourseEntity } from '../../domain/entities/course.entity';
import { CourseFindAllOptions } from '../../domain/repositories/course.repository.interface';

@Injectable()
export class CourseCacheService {
  private readonly TTL_DETAIL = 3600;
  private readonly TTL_LIST = 300;

  private readonly PREFIX = 'courses:';
  private readonly VERSION_KEY = `${this.PREFIX}version`;

  constructor(private readonly redisService: RedisService) {}

  private async getVersion(): Promise<string> {
    const v = await this.redisService.get<number>(this.VERSION_KEY);
    return v ? `v${v}` : 'v0';
  }

  private async generateListKey(
    options: CourseFindAllOptions,
  ): Promise<string> {
    const version = await this.getVersion();
    return `${this.PREFIX}list:${version}:${JSON.stringify(options)}`;
  }

  async get(id: string): Promise<CourseEntity | null> {
    const result = await this.redisService.get<CourseEntity>(
      `${this.PREFIX}${id}`,
    );
    return result;
  }

  async set(id: string, course: CourseEntity): Promise<void> {
    await this.redisService.set(`${this.PREFIX}${id}`, course, this.TTL_DETAIL);
  }

  async delete(id: string): Promise<void> {
    await this.redisService.del(`${this.PREFIX}${id}`);
  }

  async invalidateListCache(): Promise<void> {
    await this.redisService.increment(this.VERSION_KEY);
  }

  async list(
    options: CourseFindAllOptions,
  ): Promise<{ courses: CourseEntity[]; total: number } | null> {
    const key = await this.generateListKey(options);
    return await this.redisService.get(key);
  }

  async setList(
    options: CourseFindAllOptions,
    result: { courses: CourseEntity[]; total: number },
  ): Promise<void> {
    const key = await this.generateListKey(options);
    await this.redisService.set(key, result, this.TTL_LIST);
  }
}
