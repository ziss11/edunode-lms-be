import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'path';
import postgres from 'postgres';

dotenv.config();

async function main() {
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const host = process.env.POSTGRES_HOST;
  const port = process.env.POSTGRES_PORT;
  const database = process.env.POSTGRES_DB;

  const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
  console.log('🔄 Running migrations...');

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  await migrate(db, {
    migrationsFolder: path.join(__dirname, './'),
  });

  console.log('✅ Migrations completed successfully!');

  await sql.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Migration failed!');
  console.error(err);
  process.exit(1);
});
