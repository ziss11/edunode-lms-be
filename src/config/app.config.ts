import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const appConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3000),
  appName: z.string().default('EduNode'),
  apiPrefix: z.string().default('api'),
  apiVersion: z.string().default('v1'),
  corsOrigins: z.string().default('*'),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export default registerAs('app', (): AppConfig => {
  const config = appConfigSchema.parse({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.APP_PORT,
    appName: process.env.APP_NAME,
    apiPrefix: process.env.API_PREFIX,
    apiVersion: process.env.API_VERSION,
    corsOrigins: process.env.CORS_ORIGINS,
  });

  return config;
});
