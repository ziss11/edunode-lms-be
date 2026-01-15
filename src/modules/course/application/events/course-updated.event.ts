export class CourseUpdatedEvent {
  constructor(
    public readonly courseId: string,
    public readonly changes: Record<string, any>,
    public readonly timestamp: Date = new Date(),
  ) {}
}
