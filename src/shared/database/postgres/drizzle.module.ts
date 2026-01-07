import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const DRIZZLE_ORM = 'DRIZZLE_ORM';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_ORM,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get('database.postgres') as {
          host: string;
          port: number;
          database: string;
          username: string;
          password: string;
        };

        const connectionString = `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
        const client = postgres(connectionString, {
          max: 10,
          idle_timeout: 20,
          connect_timeout: 10,
        });

        const db = drizzle(client);
        console.log('✅ Drizzle ORM connected to PostgreSQL');

        return db;
      },
    },
  ],
  exports: [DRIZZLE_ORM],
})
export class DrizzleModule {}
