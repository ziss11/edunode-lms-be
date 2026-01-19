import { CourseEntity } from '../entities/course.entity';
import { CourseLevel } from '../enums/course-level.enum';

export interface CourseFindAllOptions {
  page?: number;
  limit?: number;
  orderBy?: 'id' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
  filters?: {
    search?: string;
    instructorId?: string;
    isPublished?: boolean;
    level?: CourseLevel;
    price?: {
      min?: number;
      max?: number;
    };
  };
}

export interface ICourseRepository {
  create(course: CourseEntity): Promise<CourseEntity>;
  findById(id: string): Promise<CourseEntity | null>;
  findAll(
    options: CourseFindAllOptions,
  ): Promise<{ courses: CourseEntity[]; total: number }>;
  update(id: string, course: CourseEntity): Promise<CourseEntity>;
  delete(id: string): Promise<void>;
}
