import {
  Body,
  Controller,
  Delete,
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
import { Role, Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { ResponseUtils } from '../../../common/utils/response.util';
import { CreateLessonDto } from '../application/dto/create-lesson.dto';
import { LessonResponseDto } from '../application/dto/lesson.respons.dto';
import { LessonParamDto } from '../application/dto/params/lesson.param.dto';
import { UpdateLessonDto } from '../application/dto/update-lesson.dto';
import { CreateLessonUseCase } from '../application/use-cases/create-lesson.use-case';
import { DeleteLessonUseCase } from '../application/use-cases/delete-lesson.use-case';
import { UpdateLessonUseCase } from '../application/use-cases/update-lesson.use-case';

@ApiTags('Lessons')
@Controller('lessons')
@ApiBearerAuth('JWT Auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonController {
  constructor(
    private readonly createLessonUseCase: CreateLessonUseCase,
    private readonly updateLessonUseCase: UpdateLessonUseCase,
    private readonly deleteLessonUseCase: DeleteLessonUseCase,
  ) {}

  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Validate(CreateLessonDto)
  @ApiOperation({ summary: 'Add a new lesson' })
  @ApiStandardResponse(LessonResponseDto, { status: HttpStatus.CREATED })
  async create(@Body() dto: CreateLessonDto) {
    const result = await this.createLessonUseCase.execute(dto);
    return ResponseUtils.successWithData(result);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Validate(LessonParamDto)
  @Validate(UpdateLessonDto)
  @ApiOperation({ summary: 'Update a lesson' })
  @ApiStandardResponse(LessonResponseDto)
  async update(@Param() params: LessonParamDto, @Body() dto: UpdateLessonDto) {
    const result = await this.updateLessonUseCase.execute(params.id, dto);
    return ResponseUtils.successWithData(result);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Validate(LessonParamDto)
  @ApiOperation({ summary: 'Delete a lesson' })
  @ApiStandardResponse(LessonResponseDto)
  async delete(@Param() params: LessonParamDto) {
    await this.deleteLessonUseCase.execute(params.id);
    return ResponseUtils.success();
  }
}
