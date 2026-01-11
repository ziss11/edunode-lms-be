import { registerAs } from '@nestjs/config';

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
  ttl: number;
}

export default registerAs('redis', (): RedisConfig => {
  const config: RedisConfig = {
    host: process.env.REDIS_HOST || '',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: Number(process.env.REDIS_DB) || 0,
    ttl: Number(process.env.REDIS_TTL) || 3600,
  };
  return config;
});
