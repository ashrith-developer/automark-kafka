import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import ProcessedEvent from '../models/ProcessedEvent.js';
import Notification from '../models/Notification.js';
import { TOPICS } from './topics.js';

dotenv.config();

const kafka = new Kafka({
  clientId: 'welcome-email-consumer',
  brokers: ['localhost:9092'],
});

const groupId = process.argv[2] || 'welcome-email-service';
const consumer = kafka.consumer({ groupId });
const dlqProducer = kafka.producer();

const run = async () => {
  await connectDB();
  await consumer.connect();
  await dlqProducer.connect();
  console.log(`User consumer connected with groupId: ${groupId}`);

  await consumer.subscribe({
    topic: TOPICS.USER_REGISTERED,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const event = JSON.parse(message.value.toString());

        // Extract metadata with backward compatibility
        const eventId = event.eventId;
        const eventType = event.eventType || event.event;
        const payload = event.payload || event;

        if (!eventId) {
          console.warn('Skipping event: missing eventId');
          return;
        }

        const existingEvent = await ProcessedEvent.findOne({ eventId });
        if (existingEvent) {
          console.log(`Duplicate user event skipped: ${eventId}`);
          return;
        }

        console.log(`Processing eventId: ${eventId} (${eventType})`);

        if (eventType === 'UserRegistered') {
          // Log console action
          console.log(`Welcome email sent to ${payload.email}`);

          // Persist a Notification record in MongoDB
          await Notification.create({
            userId: payload.userId,
            type: 'welcome_email',
            email: payload.email,
            status: 'sent',
          });

          console.log(`Notification record created in DB for ${payload.email}`);
        }

        // Record that the event was processed
        await ProcessedEvent.create({
          eventId,
          eventType,
        });

      } catch (error) {
        console.error('User consumer failed, sending to DLQ:', error.message);

        try {
          await dlqProducer.send({
            topic: TOPICS.USER_REGISTERED_DLQ,
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
          console.error('Failed to send user DLQ event:', dlqError.message);
        }
      }
    },
  });
};

run().catch((error) => {
  console.error('User consumer error:', error);
});

// Graceful Shutdown Logic
const shutdown = async () => {
  console.log('Shutting down welcome email consumer...');
  try {
    await consumer.disconnect();
    await dlqProducer.disconnect();
    console.log('Welcome email consumer and DLQ producer disconnected cleanly');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
