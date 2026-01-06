import { z } from 'zod';

export const environmentSchema = z.object({
  // App
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  APP_PORT: z.coerce.number().default(3000),
  APP_NAME: z.string().default('EduNode'),

  // PostgreSQL
  POSTGRES_HOST: z.string().default('localhost'),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USER: z.string().default('postgres'),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string().default('edunode_db'),

  // MongoDB
  MONGODB_URI: z.string().default('mongodb://localhost:27017/edunode_logs'),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // RabbitMQ
  RABBITMQ_URL: z.string().default('amqp://localhost:5672'),
  RABBITMQ_QUEUE_NAME: z.string().default('edunode_queue'),

  // MinIO
  MINIO_ENDPOINT: z.string().default('localhost'),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_ACCESS_KEY: z.string().default('minioadmin'),
  MINIO_SECRET_KEY: z.string().default('minioadmin'),
  MINIO_BUCKET: z.string().default('edunode-files'),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

export type Environment = z.infer<typeof environmentSchema>;

export function validateEnvironment(
  config: Record<string, unknown>,
): Environment {
  const parsed = environmentSchema.safeParse(config);

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      z.treeifyError(parsed.error),
    );
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}
