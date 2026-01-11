import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { WinstonLogger } from './common/utils/winston.logger';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLogger(),
  });

  const configService = app.get(ConfigService);

  // Get Configurations
  const port = configService.get<number>('port', 3000);
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api');
  const apiVersion = configService.get<string>('app.apiVersion', 'v1');
  const corsOrigins = configService.get<string>('app.corsOrigins', '*');
  const nodeEnv = configService.get<string>('app.nodeEnv', 'development');

  // Global Prefix
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  // CORS
  app.enableCors({
    origin: corsOrigins === '*' ? true : corsOrigins.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-Id'],
  });

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger Documentation (only in development)
  if (nodeEnv === 'development') {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorted: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'Edunode LMS API',
      customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    });
  }

  // Gracefull Shutdown
  app.enableShutdownHooks();
  await app.listen(port);

  console.log(`
  🚀 EduNode API Server

  Environment:  ${nodeEnv.padEnd(45)}
  Server:       http://localhost:${port}/${apiPrefix}/${apiVersion}${' '.repeat(22)}
  Swagger Docs: http://localhost:${port}/api/docs${' '.repeat(23)}                    

  📊 Infrastructure Services:                                                         
  - PostgreSQL: localhost:5432                                                        
  - MongoDB:    localhost:27017                                                       
  - Redis:      localhost:6379                                                        
  - RabbitMQ:   localhost:5672 (Management: 15672)                                    
  - MinIO:      localhost:9000 (Console: 9001)                                        
  `);
}
bootstrap().catch((err) => {
  console.error('❌ Failed to start the application:', err);
  process.exit(1);
});
