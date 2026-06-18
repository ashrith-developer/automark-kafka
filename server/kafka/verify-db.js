import connectDB from '../config/db.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Analytics from '../models/Analytics.js';
import ProcessedEvent from '../models/ProcessedEvent.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const verify = async () => {
    await connectDB();

    console.log('\n=== MongoDB State Verification ===\n');

    const usersCount = await User.countDocuments();
    console.log(`- Total Users in DB: ${usersCount}`);

    const processedCount = await ProcessedEvent.countDocuments();
    console.log(`- Total Processed Events: ${processedCount}`);

    const notifications = await Notification.find().populate('userId', 'name email');
    console.log(`\n- Notifications Table (${notifications.length} records):`);
    notifications.forEach(n => {
        console.log(`  [${n.status}] Type: ${n.type} -> Sent to: ${n.email} (User: ${n.userId?.name || 'unknown'})`);
    });

    const analytics = await Analytics.find().populate('userId', 'name');
    console.log(`\n- Pre-aggregated Analytics Table (${analytics.length} records):`);
    analytics.forEach(a => {
        console.log(`  User: ${a.userId?.name || 'unknown'}`);
        console.log(`  * Total Content Generated: ${a.contentGeneratedCount}`);
        console.log(`  * Last Generated At: ${a.lastGeneratedAt}`);
        // Convert ES6 Map to object for pretty printing
        const platformsObj = Object.fromEntries(a.platformCounts || new Map());
        console.log(`  * Platform Counts:`, platformsObj);
    });

    console.log('\n====================================');
    await mongoose.disconnect();
};

verify().catch(console.error);
