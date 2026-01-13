import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import minioConfig from './config/minio.config';
import rabbitmqConfig from './config/rabbitmq.config';
import redisConfig from './config/redis.config';
import { validateEnvironment } from './config/validation.schema';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MongodbModule } from './shared/database/mongodb/mongodb.module';
import { DrizzleModule } from './shared/database/postgres/drizzle.module';
import { RedisModule } from './shared/database/redis/redis.module';
import { RabbitMQModule } from './shared/messaging/rabbitmq/rabbitmq.module';
import { MinioModule } from './shared/storage/minio/minio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        rabbitmqConfig,
        minioConfig,
        jwtConfig,
      ],
      validate: validateEnvironment,
      envFilePath: ['.env', '.env.local'],
      expandVariables: true,
    }),
    CommonModule,
    DrizzleModule,
    MongodbModule,
    RedisModule,
    RabbitMQModule.forRoot(),
    MinioModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    // { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
