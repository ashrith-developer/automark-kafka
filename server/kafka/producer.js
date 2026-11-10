import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { ensureKafkaTopics } from './admin.js';
import { retryKafkaOperation } from './retry.js';
import { TOPICS } from './topics.js';

dotenv.config();

const kafkaEnabled = process.env.KAFKA_ENABLED !== 'false';

const kafka = new Kafka({
  clientId: 'automark-api',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  retry: {
    retries: 20,
    initialRetryTime: 3000,
  },
});

export const producer = kafka.producer();

export const connectProducer = async () => {
  if (!kafkaEnabled) {
    console.log('Kafka integration disabled');
    return;
  }

  await ensureKafkaTopics();
  await retryKafkaOperation(() => producer.connect(), 'Kafka producer connection');
  console.log('Kafka producer connected');
};

export const disconnectProducer = async () => {
  if (!kafkaEnabled) return;

  try {
    await producer.disconnect();
    console.log('Kafka producer disconnected cleanly');
  } catch (error) {
    console.error('Error disconnecting Kafka producer:', error);
  }
};

export const publishContentGenerated = async (event) => {
  if (!kafkaEnabled) return;

  await producer.send({
    topic: TOPICS.CONTENT_GENERATED,
    messages: [
      {
        key: event.payload.contentId,
        value: JSON.stringify(event),
      },
    ],
  });
};

export const publishUserRegistered = async (event) => {
  if (!kafkaEnabled) return;

  await producer.send({
    topic: TOPICS.USER_REGISTERED,
    messages: [
      {
        key: event.payload.userId,
        value: JSON.stringify(event),
      },
    ],
  });
};
