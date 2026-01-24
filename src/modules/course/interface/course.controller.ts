import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { ApiStandardResponse } from '../../../common/decorators/api-response.decorator';
import { Role, Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { MetaResponse } from '../../../common/responses/meta.response';
import { ResponseUtils } from '../../../common/utils/response.util';
import { CourseResponseDto } from '../application/dto/course.response.dto';
import { CreateCourseDto } from '../application/dto/create-course.dto';
import { CourseParamDto } from '../application/dto/params/course.param.dto';
import { ListCoursesQueryDto } from '../application/dto/queries/list-courses.query.dto';
import { UpdateCourseDto } from '../application/dto/update-course.dto';
import { CreateCourseUseCase } from '../application/use-cases/create-course.use-case';
import { DeleteCourseUseCase } from '../application/use-cases/delete-course.use-case';
import { GetCourseUseCase } from '../application/use-cases/get-course.use-case';
import { ListCoursesUseCase } from '../application/use-cases/list-courses.use-case';
import { PublishCourseUseCase } from '../application/use-cases/publish-course.use-case';
import { UnpublishCourseUseCase } from '../application/use-cases/unpublish-course.use-case';
import { UpdateCourseUseCase } from '../application/use-cases/update-course.use-case';

@ApiTags('Courses')
@Controller('courses')
@ApiBearerAuth('JWT Auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseController {
  constructor(
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly getCourseUseCase: GetCourseUseCase,
    private readonly listCoursesUseCase: ListCoursesUseCase,
    private readonly updateCourseUseCase: UpdateCourseUseCase,
    private readonly deleteCourseUseCase: DeleteCourseUseCase,
    private readonly publishCourseUseCase: PublishCourseUseCase,
    private readonly unpublishCourseUseCase: UnpublishCourseUseCase,
  ) {}

  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.INSTRUCTOR)
  @HttpCode(HttpStatus.CREATED)
  @Validate(CreateCourseDto)
  @ApiOperation({ summary: 'Create a new course' })
  @ApiStandardResponse(CourseResponseDto, { status: HttpStatus.CREATED })
  async create(@Body() dto: CreateCourseDto) {
    const result = await this.createCourseUseCase.execute(dto);
    return ResponseUtils.successWithData(result);
  }

  @Get()
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  @Validate(ListCoursesQueryDto)
  @ApiOperation({ summary: 'List all courses' })
  @ApiStandardResponse(CourseResponseDto, { isArray: true })
  async list(@Query() queries: ListCoursesQueryDto) {
    const { page = 1, limit = 10 } = queries;
    const { courses, total } = await this.listCoursesUseCase.execute({
      page,
      limit,
    });
    const meta = new MetaResponse({
      page: page,
      limit: limit,
      totalData: total,
      totalPages: Math.ceil(total / limit),
    });
    return ResponseUtils.successWithPagination(courses, meta);
  }

  @Get(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  @Validate(CourseParamDto)
  @ApiOperation({ summary: 'Get course by id' })
  @ApiStandardResponse(CourseResponseDto)
  async get(@Param() params: CourseParamDto) {
    const result = await this.getCourseUseCase.execute(params.id);
    return ResponseUtils.successWithData(result);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.INSTRUCTOR)
  @HttpCode(HttpStatus.OK)
  @Validate(CourseParamDto)
  @Validate(UpdateCourseDto)
  @ApiOperation({ summary: 'Update course' })
  @ApiStandardResponse(CourseResponseDto)
  async update(@Param() params: CourseParamDto, @Body() dto: UpdateCourseDto) {
    const result = await this.updateCourseUseCase.execute(params.id, dto);
    return ResponseUtils.successWithData(result);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.INSTRUCTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Validate(CourseParamDto)
  @ApiOperation({ summary: 'Delete course' })
  @ApiStandardResponse(undefined, { status: HttpStatus.NO_CONTENT })
  async delete(@Param() params: CourseParamDto) {
    await this.deleteCourseUseCase.execute(params.id);
    return ResponseUtils.success();
  }

  @Patch(':id/publish')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Validate(CourseParamDto)
  @ApiOperation({ summary: 'Publish course' })
  @ApiStandardResponse(CourseResponseDto)
  async publish(@Param() params: CourseParamDto) {
    const result = await this.publishCourseUseCase.execute(params.id);
    return ResponseUtils.successWithData(result);
  }

  @Patch(':id/unpublish')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Validate(CourseParamDto)
  @ApiOperation({ summary: 'Unpublish course' })
  @ApiStandardResponse(CourseResponseDto)
  async unpublish(@Param() params: CourseParamDto) {
    const result = await this.unpublishCourseUseCase.execute(params.id);
    return ResponseUtils.successWithData(result);
  }
}
