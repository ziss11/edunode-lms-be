import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { ApiStandardResponse } from '../../../common/decorators/api-response.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../../../common/guards/jwt-refresh.guard';
import { ResponseUtils } from '../../../common/utils/response.util';
import { UserResponseDto } from '../../user/application/dto/user.response.dto';
import { GetUserUseCase } from '../../user/application/use-cases/get-user.use-case';
import { AuthResponseDto } from '../application/dto/auth.response.dto';
import { LoginDto } from '../application/dto/login.dto';
import { RegisterDto } from '../application/dto/register.dto';
import { UpdatePasswordDto } from '../application/dto/update-password.dto';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { LogoutUseCase } from '../application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { UpdatePasswordUseCase } from '../application/use-cases/update-password.use-case';

@ApiTags('Auths')
@Controller('auths')
@Injectable()
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Validate(LoginDto)
  @ApiOperation({ summary: 'Login user' })
  @ApiStandardResponse(AuthResponseDto)
  async login(@Body() dto: LoginDto) {
    const result = await this.loginUseCase.execute(dto);
    return ResponseUtils.successWithData(result);
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Validate(RegisterDto)
  @ApiOperation({ summary: 'Register user' })
  @ApiStandardResponse(AuthResponseDto)
  async register(@Body() dto: RegisterDto) {
    const result = await this.registerUseCase.execute(dto);
    return ResponseUtils.successWithData(result);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth('JWT Auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh token' })
  @ApiStandardResponse(AuthResponseDto)
  async refresh(@CurrentUser('id') userId: string) {
    const result = await this.refreshTokenUseCase.execute(userId);
    return ResponseUtils.successWithData(result);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT Auth')
  @ApiOperation({ summary: 'Get logged user info' })
  @ApiStandardResponse(UserResponseDto)
  async me(@CurrentUser('id') userId: string) {
    const user = await this.getUserUseCase.execute(userId);
    return ResponseUtils.successWithData(user);
  }

  @Patch('update-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT Auth')
  @HttpCode(HttpStatus.OK)
  @Validate(UpdatePasswordDto)
  @ApiOperation({ summary: 'Update user password' })
  @ApiStandardResponse()
  async updatePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    await this.updatePasswordUseCase.execute(userId, dto);
    return ResponseUtils.successWithData('Password changed successfully');
  }

  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT Auth')
  @ApiOperation({ summary: 'Logout user' })
  @ApiStandardResponse(AuthResponseDto)
  async logout(@CurrentUser('id') userId: string) {
    await this.logoutUseCase.execute(userId);
    return ResponseUtils.successWithData('User logged out successfully');
  }
}
