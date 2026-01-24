export class CourseCreatedEvent {
  constructor(
    public readonly courseId: string,
    public readonly instructorId: string,
    public readonly title: string,
    public readonly price: number,
    public readonly timestamp: Date = new Date(),
  ) {}
}
