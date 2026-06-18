import express from 'express'; // restart for groq model update
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { connectProducer, disconnectProducer } from './kafka/producer.js';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

dotenv.config();

const app = express();

// Connect to Database
connectDB();
connectProducer().catch((error) => {
  console.error('Kafka producer connection failed:', error);
});
// Middleware
app.use(cors());
app.use(express.json());
// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
// Trigger restart
// Graceful Shutdown Logic
const shutdown = async () => {
  console.log('Shutting down server...');
  try {
    await disconnectProducer();
    console.log('Graceful shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
