/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

export const RABBITMQ_CONNECTION = 'RABBITMQ_CONNECTION';
export const RABBITMQ_CHANNEL = 'RABBITMQ_CHANNEL';

export interface MessageOptions {
  persistent?: boolean;
  expiration?: string;
  priority?: number;
  correlationId?: string;
}

@Injectable()
export class RabbitMQService implements OnModuleDestroy {
  private readonly exchangeName: string;

  constructor(
    @Inject(RABBITMQ_CHANNEL) private readonly channel: amqp.Channel,
    private readonly configService: ConfigService,
  ) {
    this.exchangeName = this.configService.get(
      'rabbitmq.exchangeName',
    ) as string;
  }

  publish(routingKey: string, message: any, options?: MessageOptions): boolean {
    try {
      const content = Buffer.from(JSON.stringify(message));
      return this.channel.publish(this.exchangeName, routingKey, content, {
        persistent: options?.persistent ?? true,
        expiration: options?.expiration,
        priority: options?.priority,
        correlationId: options?.correlationId,
        contentType: 'application/json',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('❌ RabbitMQ publish error:', error);
      return false;
    }
  }

  async subscribe(
    queueName: string,
    routingKey: string,
    callback: (message: any) => Promise<void>,
  ): Promise<void> {
    try {
      await this.channel.assertQueue(queueName, { durable: true });
      await this.channel.bindQueue(queueName, this.exchangeName, routingKey);
      await this.channel.prefetch(1);
      await this.channel.consume(
        queueName,
        (msg) => {
          if (msg) {
            void (async () => {
              try {
                const content = JSON.parse(msg.content.toString());
                await callback(content);
                this.channel.ack(msg);
              } catch (error) {
                console.error('❌ RabbitMQ consume error:', error);
                this.channel.nack(msg, false, false);
              }
            })();
          }
        },
        { noAck: false },
      );
      console.log(
        `✅ RabbitMQ subscribed to "${queueName}" with routing key "${routingKey}"`,
      );
    } catch (error) {
      console.error('❌ RabbitMQ subscribe error:', error);
      throw error;
    }
  }

  async sendToQueue(
    queueName: string,
    message: any,
    options?: MessageOptions,
  ): Promise<boolean> {
    try {
      await this.channel.assertQueue(queueName, { durable: true });
      const content = Buffer.from(JSON.stringify(message));
      return this.channel.sendToQueue(queueName, content, {
        persistent: options?.persistent ?? true,
        contentType: 'application/json',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('❌ RabbitMQ sendToQueue error:', error);
      return false;
    }
  }

  async createQueue(queueName: string): Promise<void> {
    await this.channel.assertQueue(queueName, {
      durable: true,
      arguments: {
        'x-message-ttl': 86400000,
      },
    });
  }

  async deleteQueue(queueName: string): Promise<void> {
    await this.channel.deleteQueue(queueName);
  }

  async purgeQueue(queueName: string): Promise<void> {
    await this.channel.purgeQueue(queueName);
  }

  async onModuleDestroy() {
    await this.channel.close();
  }
}
