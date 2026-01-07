/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as Minio from 'minio';
import { Readable } from 'stream';

export interface UploadOptions {
  folder?: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  contentType: string;
}

@Injectable()
export class MinioService {
  private readonly bucketName: string;

  constructor(
    @Inject('MINIO_CLIENT') private readonly minioClient: Minio.Client,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get('minio.bucket') as string;
  }

  async uploadFile(
    file: Buffer | Readable,
    originalFilename: string,
    options?: UploadOptions,
  ): Promise<UploadResult> {
    const folder = options?.folder || 'uploads';
    const extension = originalFilename.split('.').pop();
    const uniqueFilename = `${folder}/${randomUUID()}.${extension}`;

    const metadata: Minio.ItemBucketMetadata = {
      'Content-Type': options?.contentType || this.getContentType(extension),
      ...options?.metadata,
    };

    const size = Buffer.isBuffer(file) ? file.length : 0;
    await this.minioClient.putObject(
      this.bucketName,
      uniqueFilename,
      file,
      size,
      metadata,
    );

    const url = await this.getFileUrl(uniqueFilename);
    return {
      url,
      filename: uniqueFilename,
      size,
      contentType: metadata['Content-Type'] as string,
    };
  }

  async uploadVideo(file: Buffer, filename: string): Promise<UploadResult> {
    return this.uploadFile(file, filename, {
      folder: 'videos',
      contentType: 'video/mp4',
    });
  }

  async uploadImage(file: Buffer, filename: string): Promise<UploadResult> {
    const extension = filename.split('.').pop()?.toLowerCase();
    const contentType = this.getImageContentType(extension);
    return this.uploadFile(file, filename, {
      folder: 'images',
      contentType,
    });
  }

  async uploadDocument(file: Buffer, filename: string): Promise<UploadResult> {
    return this.uploadFile(file, filename, {
      folder: 'documents',
    });
  }

  async getFileUrl(filename: string, expiryInSeconds = 86400): Promise<string> {
    return await this.minioClient.presignedGetObject(
      this.bucketName,
      filename,
      expiryInSeconds,
    );
  }

  getPublicUrl(filename: string): string {
    const endpoint = this.configService.get('minio.endPoint') as string;
    const port = this.configService.get('minio.port') as number;
    const useSSL = this.configService.get('minio.useSSL') as boolean;

    const protocol = useSSL ? 'https' : 'http';
    return `${protocol}://${endpoint}:${port}/${this.bucketName}/${filename}`;
  }

  async downloadFile(filename: string): Promise<Buffer> {
    const stream = await this.minioClient.getObject(this.bucketName, filename);
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', chunks.push);
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  async getFileStream(filename: string): Promise<Readable> {
    return await this.minioClient.getObject(this.bucketName, filename);
  }

  async deleteFile(filename: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, filename);
  }

  async deleteFiles(filenames: string[]): Promise<void> {
    await this.minioClient.removeObjects(this.bucketName, filenames);
  }

  async listFiles(
    prefix?: string,
    maxKeys?: number,
  ): Promise<Minio.BucketItem[]> {
    const stream = this.minioClient.listObjects(this.bucketName, prefix, true, {
      MaxKeys: maxKeys,
    });
    return new Promise((resolve, reject) => {
      const items: Minio.BucketItem[] = [];
      stream.on('data', items.push);
      stream.on('error', reject);
      stream.on('end', () => resolve(items));
    });
  }

  async getFileMetadata(filename: string): Promise<Minio.BucketItemStat> {
    return this.minioClient.statObject(this.bucketName, filename);
  }

  async copyFile(sourceFilename: string, destFilename: string): Promise<void> {
    await this.minioClient.copyObject(
      this.bucketName,
      destFilename,
      `/${this.bucketName}/${sourceFilename}`,
    );
  }

  async fileExists(filename: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(this.bucketName, filename);
      return true;
    } catch (_) {
      return false;
    }
  }

  private getContentType(extension: string | undefined): string {
    const contentTypes: Record<string, string> = {
      // Images
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',

      // Videos
      mp4: 'video/mp4',
      webm: 'video/webm',
      avi: 'video/x-msvideo',
      mov: 'video/quicktime',

      // Documents
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      txt: 'text/plain',

      // Archives
      zip: 'application/zip',
      rar: 'application/x-rar-compressed',

      // Audio
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
    };

    return (
      contentTypes[extension?.toLowerCase() || ''] || 'application/octet-stream'
    );
  }

  private getImageContentType(extension: string | undefined): string {
    const imageTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
    };

    return imageTypes[extension?.toLowerCase() || ''] || 'image/jpeg';
  }

  isValidFileType(filename: string, allowedTypes: string[]): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
  }

  isValidFileSize(size: number, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return size <= maxSizeInBytes;
  }
}
