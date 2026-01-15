export class CoursePublishedEvent {
  constructor(
    public readonly courseId: string,
    public readonly instructorId: string,
    public readonly title: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
