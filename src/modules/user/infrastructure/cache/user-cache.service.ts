import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../../shared/database/redis/redis.service';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserFindAllOptions } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserCacheService {
  private readonly TTL_DETAIL = 3600;
  private readonly TTL_LIST = 300;

  private readonly PREFIX = 'users:';
  private readonly VERSION_KEY = `${this.PREFIX}version`;

  constructor(private readonly redisService: RedisService) {}

  private async getVersion(): Promise<string> {
    const v = await this.redisService.get<number>(this.VERSION_KEY);
    return v ? `v${v}` : 'v0';
  }

  private async generateListKey(options: UserFindAllOptions): Promise<string> {
    const version = await this.getVersion();
    return `${this.PREFIX}list:${version}:${JSON.stringify(options)}`;
  }

  async get(id: string): Promise<UserEntity | null> {
    const result = await this.redisService.get<UserEntity>(
      `${this.PREFIX}${id}`,
    );
    return result || null;
  }

  async set(id: string, user: UserEntity) {
    await this.redisService.set(`${this.PREFIX}${id}`, user, this.TTL_DETAIL);
  }

  async delete(id: string): Promise<void> {
    await this.redisService.del(`${this.PREFIX}${id}`);
  }

  async invalidateListCache() {
    await this.redisService.increment(this.VERSION_KEY);
  }

  async list(
    options: UserFindAllOptions,
  ): Promise<{ users: UserEntity[]; total: number } | null> {
    const key = await this.generateListKey(options);
    return await this.redisService.get(key);
  }

  async setList(
    options: UserFindAllOptions,
    result: { users: UserEntity[]; total: number },
  ) {
    const key = await this.generateListKey(options);
    await this.redisService.set(key, result, this.TTL_LIST);
  }
}
