import { registerAs } from '@nestjs/config';

export interface AppConfig {
  nodeEnv: string;
  port: number;
  appName: string;
  apiPrefix: string;
  apiVersion: string;
  corsOrigins: string;
}

export default registerAs('app', (): AppConfig => {
  const config: AppConfig = {
    nodeEnv: process.env.NODE_ENV || '',
    port: Number(process.env.APP_PORT) || 3000,
    appName: process.env.APP_NAME || '',
    apiPrefix: process.env.API_PREFIX || '',
    apiVersion: process.env.API_VERSION || '',
    corsOrigins: process.env.CORS_ORIGINS || '',
  };
  return config;
});
