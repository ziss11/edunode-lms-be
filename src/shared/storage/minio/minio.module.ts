import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { MinioService } from './minio.service';

export const MINIO_CLIENT = 'MINIO_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: MINIO_CLIENT,
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<Minio.Client> => {
        const config = configService.get('minio') as {
          endPoint: string;
          port: number;
          useSSL: boolean;
          accessKey: string;
          secretKey: string;
          bucket: string;
        };
        const client = new Minio.Client({
          endPoint: config.endPoint,
          port: config.port,
          useSSL: config.useSSL,
          accessKey: config.accessKey,
          secretKey: config.secretKey,
        });

        const bucketName = config.bucket;
        const bucketExists = await client.bucketExists(bucketName);

        if (!bucketExists) {
          await client.makeBucket(bucketName);
          console.log(`✅ Minio bucket "${bucketName}" created`);
        } else {
          console.log(`✅ Minio bucket "${bucketName}" already exists`);
        }

        return client;
      },
    },
    MinioService,
  ],
  exports: [MINIO_CLIENT, MinioService],
})
export class MinioModule {}
