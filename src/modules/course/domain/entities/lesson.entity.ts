import { Duration } from '../value-objects/duration.vo';

export class LessonEntity {
  constructor(
    public readonly id: string,
    public readonly courseId: string,
    public title: string,
    public content: string,
    public videoUrl: string,
    public duration: Duration,
    public order: number,
    public isFreePreview: boolean = false,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  updateContent(title: string, content: string) {
    this.title = title;
    this.content = content;
    this.updatedAt = new Date();
  }

  changeVideo(videoUrl: string, newDuration: Duration) {
    this.videoUrl = videoUrl;
    this.duration = newDuration;
    this.updatedAt = new Date();
  }

  reorder(newOrder: number) {
    if (newOrder < 1) throw new Error('Order must be greater than 0');
    this.order = newOrder;
    this.updatedAt = new Date();
  }

  toggleFreePreview() {
    this.isFreePreview = !this.isFreePreview;
    this.updatedAt = new Date();
  }
}
