import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const minioConfigSchema = z.object({
  endpoint: z.string().default('localhost'),
  port: z.coerce.number().default(9000),
  accessKey: z.string().default('minioadmin'),
  secretKey: z.string().default('minioadmin'),
  bucket: z.string().default('edunode-files'),
  useSSL: z.boolean().default(false),
});

export type MinioConfig = z.infer<typeof minioConfigSchema>;

export default registerAs('minio', (): MinioConfig => {
  const config = minioConfigSchema.parse({
    endpoint: process.env.MINIO_ENDPOINT,
    port: process.env.MINIO_PORT,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucket: process.env.MINIO_BUCKET,
    useSSL: process.env.MINIO_USE_SSL === 'true',
  });

  return config;
});
