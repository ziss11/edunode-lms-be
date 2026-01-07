import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';

export const MONGODB_CONNECTION = 'MONGODB_CONNECTION';
export const MONGODB_DATABASE = 'MONGODB_DATABASE';

@Global()
@Module({
  providers: [
    {
      provide: MONGODB_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get('database.mongodb.uri') as string;
        const client = new MongoClient(uri);

        await client.connect();
        console.log('✅ MongoDB connected');

        return client;
      },
    },
    {
      provide: MONGODB_DATABASE,
      inject: [MONGODB_CONNECTION],
      useFactory: (client: MongoClient): Db => {
        return client.db();
      },
    },
  ],
  exports: [MONGODB_CONNECTION, MONGODB_DATABASE],
})
export class MongodbModule {}
