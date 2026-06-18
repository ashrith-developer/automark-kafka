import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  targetAudience: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    enum: ['Professional', 'Casual', 'Humorous', 'Inspirational'],
    required: true,
  },
  platforms: {
    type: [String],
    required: true,
  },
  generatedContent: {
    type: Object,
    required: true,
  },
  scheduledFor: {
    type: Date,
  },
}, { timestamps: true });

export default mongoose.model('Content', ContentSchema);
