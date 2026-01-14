import { CourseLevel } from '../enums/course-level.enum';
import { Price } from '../value-objects/price.vo';

export class CourseEntity {
  constructor(
    public readonly id: string,
    public title: string,
    public slug: string,
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
    return true;
  }

  unpublish() {
    this.isPublished = false;
    return true;
  }

  updateDetails(title: string, description: string, level: CourseLevel): void {
    this.title = title;
    this.description = description;
    this.level = level;
    this.updatedAt = new Date();
  }

  changePrice(newPrice: Price): void {
    this.price = newPrice;
    this.updatedAt = new Date();
  }

  setThumbnail(url: string): void {
    this.coverImageUrl = url;
    this.updatedAt = new Date();
  }
}
