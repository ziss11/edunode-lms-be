import { registerAs } from '@nestjs/config';

export interface MinioConfig {
  endpoint: string;
  port: number;
  accessKey: string;
  secretKey: string;
  bucket: string;
  useSSL: boolean;
}

export default registerAs('minio', (): MinioConfig => {
  const config: MinioConfig = {
    endpoint: process.env.MINIO_ENDPOINT || '',
    port: Number(process.env.MINIO_PORT) || 9000,
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET_KEY || '',
    bucket: process.env.MINIO_BUCKET || '',
    useSSL: process.env.MINIO_USE_SSL === 'true',
  };
  return config;
});
