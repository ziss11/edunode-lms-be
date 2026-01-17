import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../../shared/database/redis/redis.service';
import { CourseEntity } from '../../domain/entities/course.entity';

@Injectable()
export class CourseCacheService {
  constructor(private readonly redisService: RedisService) {}

  async getCourses() {
    const courses = await this.redisService.get<CourseEntity[]>('courses');
    return courses;
  }

  async setCourses(courses: CourseEntity[]) {
    await this.redisService.set('courses', courses);
  }

  async deleteCourses() {
    await this.redisService.del('courses');
  }

  async getCourseById(id: string) {
    const course = await this.redisService.get<CourseEntity>(`course:${id}`);
    return course;
  }

  async setCourseById(id: string, course: CourseEntity) {
    await this.redisService.set(`course:${id}`, course);
  }

  async deleteCourseById(id: string) {
    await this.redisService.del(`course:${id}`);
  }
}
