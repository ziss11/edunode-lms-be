export interface Environment {
  // App
  NODE_ENV: string;
  APP_PORT: number;
  APP_NAME: string;

  // PostgreSQL
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;

  // MongoDB
  MONGODB_URI: string;

  // Redis
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;

  // RabbitMQ
  RABBITMQ_URL: string;
  RABBITMQ_QUEUE_NAME: string;

  // MinIO
  MINIO_ENDPOINT: string;
  MINIO_PORT: number;
  MINIO_ACCESS_KEY: string;
  MINIO_SECRET_KEY: string;
  MINIO_BUCKET: string;

  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
}

export function validateEnvironment(): Environment {
  const config: Environment = {
    NODE_ENV: process.env.NODE_ENV || '',
    APP_PORT: Number(process.env.APP_PORT),
    APP_NAME: process.env.APP_NAME || '',
    POSTGRES_HOST: process.env.POSTGRES_HOST || '',
    POSTGRES_PORT: Number(process.env.POSTGRES_PORT),
    POSTGRES_USER: process.env.POSTGRES_USER || '',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
    POSTGRES_DB: process.env.POSTGRES_DB || '',
    MONGODB_URI: process.env.MONGODB_URI || '',
    REDIS_HOST: process.env.REDIS_HOST || '',
    REDIS_PORT: Number(process.env.REDIS_PORT),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
    RABBITMQ_URL: process.env.RABBITMQ_URL || '',
    RABBITMQ_QUEUE_NAME: process.env.RABBITMQ_QUEUE_NAME || '',
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || '',
    MINIO_PORT: Number(process.env.MINIO_PORT),
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || '',
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || '',
    MINIO_BUCKET: process.env.MINIO_BUCKET || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '',
  };
  return config;
}
