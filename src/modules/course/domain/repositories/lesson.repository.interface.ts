import { LessonEntity } from '../entities/lesson.entity';

export interface LessonRepositoryInterface {
  create(lesson: LessonEntity): Promise<LessonEntity>;
  findById(id: string): Promise<LessonEntity | null>;
  findByCourse(courseId: string): Promise<LessonEntity[] | null>;
  update(id: string, lesson: LessonEntity): Promise<LessonEntity | null>;
  delete(id: string): Promise<void>;
  reorder(id: string, order: number): Promise<void>;
}
