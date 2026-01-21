export class CourseCompletedEvent {
  constructor(
    public readonly id: string,
    public readonly courseId: string,
    public readonly studentId: string,
    public readonly completedAt: Date,
  ) {}
}
