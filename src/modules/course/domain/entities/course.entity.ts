import { CourseLevel } from '../enums/course-level.enum';
import { Price } from '../value-objects/price.vo';

export class CourseEntity {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public price: Price,
    public level: CourseLevel,
    public instructorId: string,
    public isPublished: boolean = false,
    public coverImageUrl?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
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
    price: Price,
    coverImageUrl?: string,
  ): void {
    this.title = title;
    this.description = description;
    this.level = level;
    this.price = price;
    this.coverImageUrl = coverImageUrl;
    this.updatedAt = new Date();
  }
}
