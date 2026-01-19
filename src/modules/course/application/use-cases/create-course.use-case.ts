import { Inject, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BadRequestException } from '../../../../common/exceptions/bad-request.exception';
import { UserRole } from '../../../user/domain/enums/user-role.enum';
import { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import { CourseEntity } from '../../domain/entities/course.entity';
import type { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { Price } from '../../domain/value-objects/price.vo';
import { CourseMapper } from '../../infrastructure/persistence/mappers/course.mapper';
import { CourseResponseDto } from '../dto/course.response.dto';
import { CreateCourseDto } from '../dto/create-course.dto';

export class CreateCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateCourseDto): Promise<CourseResponseDto> {
    const instructor = await this.userRepository.findById(dto.instructorId);
    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }
    if (instructor.role !== UserRole.INSTRUCTOR) {
      throw new BadRequestException('User is not an instructor');
    }

    const course = new CourseEntity(
      randomUUID(),
      dto.title,
      dto.description,
      new Price(dto.price),
      dto.level,
      dto.instructorId,
      dto.isPublished,
      dto.coverImageUrl,
      new Date(),
      new Date(),
    );
    const created = await this.courseRepository.create(course);
    return CourseMapper.toResponse(created);
  }
}
