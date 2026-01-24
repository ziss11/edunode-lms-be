export class EnrollmentEntity {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly courseId: string,
    public enrolledAt: Date,
    public progress: number,
    public completedAt: Date | null,
  ) {}

  updateProgress(newProgress: number) {
    this.progress = newProgress;
  }

  complete() {
    this.completedAt = new Date();
  }
}
