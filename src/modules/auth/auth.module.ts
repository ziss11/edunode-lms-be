import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GetUserUseCase } from '../user/application/use-cases/get-user.use-case';
import { UserModule } from '../user/user.module';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { UpdatePasswordUseCase } from './application/use-cases/update-password.use-case';
import { AuthenticationRepository } from './infrastructure/persistence/authentication.repository';
import { TokenService } from './infrastructure/services/token.service';
import { JwtRefreshStrategy } from './infrastructure/strategies/jwt-refresh.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { AuthController } from './interface/auth.controller';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: { expiresIn: config.get('jwt.expiresIn') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    GetUserUseCase,
    RefreshTokenUseCase,
    UpdatePasswordUseCase,
    LogoutUseCase,
    TokenService,
    JwtStrategy,
    JwtRefreshStrategy,
    {
      provide: 'IAuthenticationRepository',
      useClass: AuthenticationRepository,
    },
  ],
  exports: [TokenService, JwtStrategy],
})
export class AuthModule {}
