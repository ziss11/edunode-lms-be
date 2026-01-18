import { Global, Module } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../../generated/prisma/client';

export const PRISMA_ORM = 'PRISMA_ORM';

@Global()
@Module({
  providers: [
    {
      provide: PRISMA_ORM,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get('database.postgres') as {
          databaseUrl: string;
        };

        const adapter = new PrismaPg({ connectionString: config.databaseUrl });
        const prisma = new PrismaClient({ adapter });

        console.log('✅ Prisma ORM connected to PostgreSQL');

        return prisma;
      },
    },
  ],
  exports: [PRISMA_ORM],
})
export class PrismaModule {}
