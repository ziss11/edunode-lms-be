export class CourseEnrolledEvent {
  constructor(
    public readonly id: string,
    public readonly courseId: string,
    public readonly studentId: string,
    public readonly enrolledAt: Date,
  ) {}
}
