import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../../shared/database/redis/redis.service';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class UserCacheService {
  private readonly TTL = 3600;
  private readonly PREFIX = 'users:';

  constructor(private readonly redisService: RedisService) {}

  async get(): Promise<UserEntity[]> {
    const result = await this.redisService.get<UserEntity[]>(
      `${this.PREFIX}all`,
    );
    return result || [];
  }

  async set(users: UserEntity[]) {
    await this.redisService.set(
      `${this.PREFIX}all`,
      JSON.stringify(users),
      this.TTL,
    );
  }

  async delete(): Promise<void> {
    await this.redisService.del(`${this.PREFIX}all`);
  }
}
