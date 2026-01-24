import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { ApiStandardResponse } from '../../../common/decorators/api-response.decorator';
import {
  CurrentUser,
  CurrentUserData,
} from '../../../common/decorators/current-user.decorator';
import { Role, Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { ResponseUtils } from '../../../common/utils/response.util';
import { EnrollCourseDto } from '../application/dto/enroll-course.dto';
import { EnrollmentResponseDto } from '../application/dto/enrollment-response.dto';
import { EnrollmentParamDto } from '../application/dto/params/enrollment.param.dto';
import { UpdateProgressDto } from '../application/dto/update-progress.dto';
import { EnrollCourseUseCase } from '../application/use-cases/enroll-course.use-case';
import { GetEnrollmentUseCase } from '../application/use-cases/get-enrollment.use-case';
import { ListMyEnrollmentsUseCase } from '../application/use-cases/list-my-enrollments.use-case';
import { UpdateProgressUseCase } from '../application/use-cases/update-progress.use-case';

@ApiTags('Enrollments')
@Controller('enrollments')
@ApiBearerAuth('JWT Auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentController {
  constructor(
    private readonly enrollCourseUseCase: EnrollCourseUseCase,
    private readonly getEnrollmentUseCase: GetEnrollmentUseCase,
    private readonly listMyEnrollmentsUseCase: ListMyEnrollmentsUseCase,
    private readonly updateProgressUseCase: UpdateProgressUseCase,
  ) {}

  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  @Validate(EnrollCourseDto)
  @ApiOperation({ summary: 'Enroll a course' })
  @ApiStandardResponse(EnrollmentResponseDto, { status: HttpStatus.CREATED })
  async enrollCourse(dto: EnrollCourseDto) {
    const result = await this.enrollCourseUseCase.execute(dto);
    return ResponseUtils.successWithData(result);
  }

  @Get()
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  @Validate(EnrollmentParamDto)
  @ApiOperation({ summary: 'Get an enrollment' })
  @ApiStandardResponse(EnrollmentResponseDto)
  async getEnrollment(@Param() params: EnrollmentParamDto) {
    const result = await this.getEnrollmentUseCase.execute(params.id);
    return ResponseUtils.successWithData(result);
  }

  @Get('my')
  @Roles(Role.SUPERADMIN, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my enrollments' })
  @ApiStandardResponse(EnrollmentResponseDto, { isArray: true })
  async listMyEnrollments(@CurrentUser() user: CurrentUserData) {
    const result = await this.listMyEnrollmentsUseCase.execute(user.id);
    return ResponseUtils.successWithData(result);
  }

  @Patch(':id/progress')
  @Roles(Role.SUPERADMIN, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  @Validate(EnrollmentParamDto)
  @Validate(UpdateProgressDto)
  @ApiOperation({ summary: 'Update enrollment progress' })
  @ApiStandardResponse(EnrollmentResponseDto)
  async updateProgress(
    @Param() params: EnrollmentParamDto,
    @Body() dto: UpdateProgressDto,
  ) {
    const result = await this.updateProgressUseCase.execute(
      params.id,
      dto.progress,
    );
    return ResponseUtils.successWithData(result);
  }
}
