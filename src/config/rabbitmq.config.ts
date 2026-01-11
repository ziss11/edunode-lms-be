import { registerAs } from '@nestjs/config';

export interface RabbitMQConfig {
  url: string;
  queueName: string;
  exchangeName: string;
  exchangeType: string;
}

export default registerAs('rabbitmq', (): RabbitMQConfig => {
  const config: RabbitMQConfig = {
    url: process.env.RABBITMQ_URL || '',
    queueName: process.env.RABBITMQ_QUEUE_NAME || '',
    exchangeName: process.env.RABBITMQ_EXCHANGE_NAME || '',
    exchangeType: process.env.RABBITMQ_EXCHANGE_TYPE || '',
  };
  return config;
});
