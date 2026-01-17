import { Injectable } from '@nestjs/common';
import {
  MinioService,
  UploadResult,
} from '../../../../shared/storage/minio/minio.service';

@Injectable()
export class CourseStorageService {
  constructor(private readonly minioService: MinioService) {}

  async uploadCoverImage(
    file: Buffer,
    fileName: string,
  ): Promise<UploadResult> {
    return this.minioService.uploadImage(file, fileName);
  }

  async uploadLessonVideo(
    file: Buffer,
    fileName: string,
  ): Promise<UploadResult> {
    return this.minioService.uploadVideo(file, fileName);
  }
}
