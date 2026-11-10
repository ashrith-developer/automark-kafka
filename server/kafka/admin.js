import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { retryKafkaOperation } from './retry.js';
import { TOPICS } from './topics.js';

dotenv.config();

const kafka = new Kafka({
  clientId: 'automark-admin',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  retry: {
    retries: 20,
    initialRetryTime: 3000,
  },
});

const topicConfigs = Object.values(TOPICS).map((topic) => ({
  topic,
  numPartitions: 1,
  replicationFactor: 1,
}));

export const ensureKafkaTopics = async () => {
  await retryKafkaOperation(async () => {
    const admin = kafka.admin();

    await admin.connect();
    try {
      await admin.createTopics({
        waitForLeaders: true,
        topics: topicConfigs,
      });
    } finally {
      await admin.disconnect().catch(() => {});
    }
  }, 'Kafka topic setup');
};
