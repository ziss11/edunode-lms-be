import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  BadRequestException,
  NotFoundException,
} from '../../../../common/exceptions';
import { UserRole } from '../../../user/domain/enums/user-role.enum';
import { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import { EnrollmentEntity } from '../../domain/entities/enrollment.entity';
import type { IEnrollmentRepository } from '../../domain/repositories/enrollment.repository.interface';
import { EnrollCourseDto } from '../dto/enroll-course.dto';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';

@Injectable()
export class EnrollCourseUseCase {
  constructor(
    @Inject('IEnrollmentRepository')
    private readonly enrollmentRepository: IEnrollmentRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: EnrollCourseDto): Promise<EnrollmentResponseDto> {
    const user = await this.userRepository.findById(dto.studentId);

    if (!user) throw new NotFoundException('User not found');
    if (user.role !== UserRole.STUDENT) {
      throw new BadRequestException('User is not a student');
    }

    const enrollment = new EnrollmentEntity(
      randomUUID(),
      dto.courseId,
      dto.studentId,
      new Date(),
      0,
      null,
    );
    const result = await this.enrollmentRepository.enroll(enrollment);
    return new EnrollmentResponseDto(result);
  }
}
