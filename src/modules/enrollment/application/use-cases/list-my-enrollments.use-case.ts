import { Inject, Injectable } from '@nestjs/common';
import { BadRequestException } from '../../../../common/exceptions/bad-request.exception';
import { NotFoundException } from '../../../../common/exceptions/not-found.exception';
import { UserRole } from '../../../user/domain/enums/user-role.enum';
import { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import { IEnrollmentRepository } from '../../domain/repositories/enrollment.repository.interface';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';

@Injectable()
export class ListMyEnrollmentsUseCase {
  constructor(
    @Inject('IEnrollmentRepository')
    private readonly enrollmentRepository: IEnrollmentRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
  ): Promise<{ enrollments: EnrollmentResponseDto[]; total: number }> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('User not found');
    if (user.role !== UserRole.STUDENT) {
      throw new BadRequestException('User is not a student');
    }

    const { enrollments, total } =
      await this.enrollmentRepository.findAll(userId);
    return {
      enrollments: enrollments.map(
        (enrollment) => new EnrollmentResponseDto(enrollment),
      ),
      total,
    };
  }
}
