import { UserEntity } from '../../../user/domain/entities/user.entity';
import { CourseLevel } from '../enums/course-level.enum';
import { LessonEntity } from './lesson.entity';

export class CourseEntity {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public price: number,
    public level: CourseLevel,
    public instructorId: string,
    public isPublished: boolean = false,
    public coverImageUrl: string | null,
    public createdAt?: Date,
    public updatedAt?: Date,
    public instructor?: UserEntity,
    public lessons?: LessonEntity[],
  ) {}

  publish() {
    this.isPublished = true;
    this.updatedAt = new Date();
  }

  unpublish() {
    this.isPublished = false;
    this.updatedAt = new Date();
  }

  update(
    title: string,
    description: string,
    level: CourseLevel,
    price: number,
    coverImageUrl: string | null,
  ): void {
    this.title = title;
    this.description = description;
    this.level = level;
    this.price = price;
    this.coverImageUrl = coverImageUrl;
    this.updatedAt = new Date();
  }
}
