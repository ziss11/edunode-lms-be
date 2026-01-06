import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const databaseConfigSchema = z.object({
  postgres: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().default(5432),
    username: z.string().default('postgres'),
    password: z.string().default('postgres'),
    database: z.string().default('edunode_db'),
    ssl: z.boolean().default(false),
  }),
  mongodb: z.object({
    uri: z.string().default('mongodb://localhost:27017/edunode_logs'),
  }),
});

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;

export default registerAs('database', (): DatabaseConfig => {
  const config = databaseConfigSchema.parse({
    postgres: {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      ssl: process.env.POSTGRES_SSL === 'true',
    },
    mongodb: {
      uri: process.env.MONGODB_URI,
    },
  });

  return config;
});
