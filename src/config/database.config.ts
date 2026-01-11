import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  postgres: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl: boolean;
  };
  mongodb: {
    uri: string;
  };
}

export default registerAs('database', (): DatabaseConfig => {
  const config: DatabaseConfig = {
    postgres: {
      host: process.env.POSTGRES_HOST || '',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || '',
      password: process.env.POSTGRES_PASSWORD || '',
      database: process.env.POSTGRES_DB || '',
      ssl: process.env.POSTGRES_SSL === 'true',
    },
    mongodb: {
      uri: process.env.MONGODB_URI || '',
    },
  };
  return config;
});
