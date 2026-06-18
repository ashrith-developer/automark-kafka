import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import ProcessedEvent from '../models/ProcessedEvent.js';
import Analytics from '../models/Analytics.js';
import { TOPICS } from './topics.js';

dotenv.config();

const kafka = new Kafka({
  clientId: 'automark-consumer',
  brokers: ['localhost:9092'],
});

const groupId = process.argv[2] || 'content-events-group';

const consumer = kafka.consumer({ groupId });
const dlqProducer = kafka.producer();

const run = async () => {
  await connectDB();
  await consumer.connect();
  await dlqProducer.connect();
  console.log(`Kafka consumer connected with groupId: ${groupId}`);

  await consumer.subscribe({
    topic: TOPICS.CONTENT_GENERATED,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const event = JSON.parse(message.value.toString());

        // Extract metadata (with fallback to old schema if needed)
        const eventId = event.eventId;
        const eventType = event.eventType || event.event;
        const payload = event.payload || event;

        if (!eventId) {
          console.warn('Skipping event: missing eventId');
          return;
        }

        const existingEvent = await ProcessedEvent.findOne({ eventId });
        if (existingEvent) {
          console.log(`Duplicate event skipped: ${eventId}`);
          return;
        }

        console.log(`Processing eventId: ${eventId} (${eventType})`);

        if (eventType === 'ContentGenerated') {
          // Construct an atomic MongoDB update
          const updateFields = {
            $inc: { contentGeneratedCount: 1 },
            $set: { lastGeneratedAt: payload.createdAt || new Date() }
          };

          // Increment specific platform counts dynamically
          if (payload.platforms && Array.isArray(payload.platforms)) {
            payload.platforms.forEach(platform => {
              updateFields.$inc = updateFields.$inc || {};
              updateFields.$inc[`platformCounts.${platform}`] = 1;
            });
          }

          // Atomically update or create the Analytics document
          await Analytics.findOneAndUpdate(
            { userId: payload.userId },
            updateFields,
            { upsert: true, new: true }
          );

          console.log(`Analytics updated in DB for user ${payload.userId}`);
        }

        // Mark event as processed to prevent duplicates
        await ProcessedEvent.create({
          eventId,
          eventType,
        });

      } catch (error) {
        console.error('Consumer failed, sending to DLQ:', error.message);

        try {
          await dlqProducer.send({
            topic: TOPICS.CONTENT_GENERATED_DLQ,
            messages: [
              {
                key: message.key?.toString(),
                value: JSON.stringify({
                  originalTopic: topic,
                  originalPartition: partition,
                  originalMessage: message.value.toString(),
                  error: error.message,
                  failedAt: new Date().toISOString(),
                }),
              },
            ],
          });
        } catch (dlqError) {
          console.error('Failed to send to DLQ:', dlqError.message);
        }
      }
    },
  });
};

run().catch((error) => {
  console.error('Kafka consumer error:', error);
});

// Graceful Shutdown Logic
const shutdown = async () => {
  console.log('Shutting down analytics consumer...');
  try {
    await consumer.disconnect();
    await dlqProducer.disconnect();
    console.log('Consumer and DLQ producer disconnected cleanly');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
