import connectDB from '../config/db.js';
import Analytics from '../models/Analytics.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const clear = async () => {
    await connectDB();
    const result = await Analytics.deleteMany({});
    console.log(`Successfully cleared Analytics collection (${result.deletedCount} records deleted).`);
    await mongoose.disconnect();
};

clear().catch(console.error);
