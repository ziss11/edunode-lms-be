import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp from 'amqplib';
import { RabbitMQService } from './rabbitmq.service';

export const RABBITMQ_CONNECTION = 'RABBITMQ_CONNECTION';
export const RABBITMQ_CHANNEL = 'RABBITMQ_CHANNEL';

@Global()
@Module({})
export class RabbitMQModule {
  static forRoot(): DynamicModule {
    return {
      module: RabbitMQModule,
      providers: [
        {
          provide: RABBITMQ_CONNECTION,
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const url = configService.get('rabbitmq.url') as string;
            const connection = await amqp.connect(url);

            connection.on('error', (err) => {
              console.error('❌ RabbitMQ connection error:', err);
            });

            connection.on('close', () => {
              console.log('⚠️  RabbitMQ connection closed');
            });

            console.log('✅ RabbitMQ connected');
            return connection;
          },
        },
        {
          provide: RABBITMQ_CHANNEL,
          inject: [RABBITMQ_CONNECTION, ConfigService],
          useFactory: async (
            connection: amqp.ChannelModel,
            configService: ConfigService,
          ): Promise<amqp.Channel> => {
            const channel = await connection.createChannel();
            const exchangeName = configService.get<string>(
              'rabbitmq.exchangeName',
            ) as string;
            const exchangeType = configService.get<string>(
              'rabbitmq.exchangeType',
            ) as string;

            await channel.assertExchange(exchangeName, exchangeType, {
              durable: true,
            });
            console.log(
              `✅ RabbitMQ exchange "${exchangeName}" (${exchangeType}) created`,
            );

            return channel;
          },
        },
        RabbitMQService,
      ],
      exports: [RABBITMQ_CONNECTION, RABBITMQ_CHANNEL, RabbitMQService],
    };
  }
}
