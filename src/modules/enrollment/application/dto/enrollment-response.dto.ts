import { ApiProperty } from '@nestjs/swagger';

export class EnrollmentResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  courseId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  studentId: string;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
  })
  enrolledAt: Date | null;

  @ApiProperty({
    example: 50,
  })
  progress: number;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
  })
  completedAt: Date | null;

  constructor(enrollment: EnrollmentResponseDto) {
    this.id = enrollment.id;
    this.courseId = enrollment.courseId;
    this.studentId = enrollment.studentId;
    this.enrolledAt = enrollment.enrolledAt;
    this.progress = enrollment.progress;
    this.completedAt = enrollment.completedAt;
  }
}
