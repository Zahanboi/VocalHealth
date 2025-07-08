import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const dbConnect = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URL)
        console.log(`\nMONGODB connected :: DB_HOST :: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED ::", error);
        process.exit(1);
    }
}

export default dbConnect;
