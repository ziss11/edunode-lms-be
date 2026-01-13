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
import { BaseListResponse } from '../../../common/responses/base.response';
import { MetaResponse } from '../../../common/responses/meta.response';
import { ResponseUtils } from '../../../common/utils/response.util';
import { CreateUserDto } from '../application/dto/create-user.dto';
import { UserParamDto } from '../application/dto/params/user.param.dto';
import { ListUserQueryDto } from '../application/dto/queries/list-user.query.dto';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { UserResponseDto } from '../application/dto/user.response.dto';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('JWT Auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiStandardResponse(UserResponseDto, { status: HttpStatus.CREATED })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(dto);
    return ResponseUtils.successWithData(user);
  }

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Validate(ListUserQueryDto)
  @ApiOperation({ summary: 'List all users' })
  @ApiStandardResponse(UserResponseDto, { isArray: true })
  async list(
    @Query() query: ListUserQueryDto,
  ): Promise<BaseListResponse<UserResponseDto>> {
    const { page = 1, limit = 10 } = query;
    const { users, total } = await this.listUsersUseCase.execute(query);
    const meta = new MetaResponse({
      page: page,
      limit: limit,
      totalData: total,
      totalPages: Math.ceil(total / limit),
    });
    return ResponseUtils.successWithPagination(users, meta);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Validate(UserParamDto)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiStandardResponse(UserResponseDto)
  async get(@Param() path: UserParamDto) {
    const user = await this.getUserUseCase.execute(path.id);
    return ResponseUtils.successWithData(user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user by id' })
  @ApiStandardResponse(UserResponseDto)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.updateUserUseCase.execute(id, dto);
    return ResponseUtils.successWithData(user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiStandardResponse(undefined, { status: HttpStatus.NO_CONTENT })
  async delete(@Param('id') id: string) {
    await this.deleteUserUseCase.execute(id);
    return ResponseUtils.success();
  }
}
