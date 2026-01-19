import { LessonEntity } from '../entities/lesson.entity';

export interface ILessonRepository {
  create(lesson: LessonEntity): Promise<LessonEntity>;
  findById(id: string): Promise<LessonEntity | null>;
  update(id: string, lesson: LessonEntity): Promise<LessonEntity>;
  delete(id: string): Promise<void>;
}
