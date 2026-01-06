import { NestFactory } from '@nestjs/core';
import { createLogger } from 'winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createLogger(),
  });

  const configService = app.get(ConfigService);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
