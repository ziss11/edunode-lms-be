import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const redisConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(6379),
  password: z.string().optional(),
  db: z.coerce.number().default(0),
  ttl: z.coerce.number().default(3600), // 1 hour
});

export type RedisConfig = z.infer<typeof redisConfigSchema>;

export default registerAs('redis', (): RedisConfig => {
  const config = redisConfigSchema.parse({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
    ttl: process.env.REDIS_TTL,
  });

  return config;
});
