import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('EduNode API')
  .setDescription('Enterprise Learning Management System API Documentation')
  .setVersion('1.0')
  .addTag('auth', 'Authentication endpoints')
  .addTag('users', 'User management endpoints')
  .addTag('courses', 'Course management endpoints')
  .addTag('enrollments', 'Enrollment endpoints')
  .addTag('lessons', 'Lesson management endpoints')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .build();
