import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  postgres: {
    databaseUrl: string;
  };
  mongodb: {
    uri: string;
  };
}

export default registerAs('database', (): DatabaseConfig => {
  const config: DatabaseConfig = {
    postgres: {
      databaseUrl: process.env.DATABASE_URL || '',
    },
    mongodb: {
      uri: process.env.MONGODB_URI || '',
    },
  };
  return config;
});
