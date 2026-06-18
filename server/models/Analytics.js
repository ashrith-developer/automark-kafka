import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // One analytics record per user
    },
    contentGeneratedCount: {
        type: Number,
        default: 0,
    },
    lastGeneratedAt: {
        type: Date,
    },
    platformCounts: {
        type: Map,
        of: Number,
        default: {}, // e.g., { linkedin: 3, twitter: 5 }
    },
}, { timestamps: true });

export default mongoose.model('Analytics', AnalyticsSchema);
