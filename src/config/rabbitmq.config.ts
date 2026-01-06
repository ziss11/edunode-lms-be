import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const rabbitmqConfigSchema = z.object({
  url: z.string().default('amqp://localhost:5672'),
  queueName: z.string().default('edunode_queue'),
  exchangeName: z.string().default('edunode_exchange'),
  exchangeType: z
    .enum(['direct', 'topic', 'fanout', 'headers'])
    .default('topic'),
});

export type RabbitMQConfig = z.infer<typeof rabbitmqConfigSchema>;

export default registerAs('rabbitmq', (): RabbitMQConfig => {
  const config = rabbitmqConfigSchema.parse({
    url: process.env.RABBITMQ_URL,
    queueName: process.env.RABBITMQ_QUEUE_NAME,
    exchangeName: process.env.RABBITMQ_EXCHANGE_NAME,
    exchangeType: process.env.RABBITMQ_EXCHANGE_TYPE,
  });

  return config;
});
