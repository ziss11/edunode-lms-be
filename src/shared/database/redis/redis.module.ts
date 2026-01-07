import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { RedisService } from './redis.service';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisClientType> => {
        const config = configService.get('redis') as {
          host: string;
          port: number;
          password: string;
          db: number;
        };
        const client = createClient({
          socket: {
            host: config.host,
            port: config.port,
          },
          password: config.password,
          database: config.db,
        }) as RedisClientType;

        client.on('error', (err) =>
          console.error('❌ Redis Client Error', err),
        );
        client.on('connect', () => console.log('✅ Redis connected'));

        await client.connect();
        return client;
      },
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
