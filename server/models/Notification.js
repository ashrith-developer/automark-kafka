import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true, // e.g., 'welcome_email'
    },
    email: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['sent', 'failed'],
        default: 'sent',
    },
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);
