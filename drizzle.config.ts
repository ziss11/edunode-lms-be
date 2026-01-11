import { defineConfig } from 'drizzle-kit';

const host = process.env.POSTGRES_HOST || 'localhost';
const port = process.env.POSTGRES_PORT || '5432';
const user = process.env.POSTGRES_USER || 'edunode';
const password = process.env.POSTGRES_PASSWORD || 'secret123';
const database = process.env.POSTGRES_DB || 'edunode_db';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/modules/*/infrastructure/persistence/schema/*.schema.ts',
  out: './src/shared/database/postgres/migrations',
  dbCredentials: {
    url: `postgresql://${user}:${password}@${host}:${port}/${database}`,
  },
  verbose: true,
  strict: true,
});
