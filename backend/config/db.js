import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
const { useNewUrlParser, useUnifiedTopology, connect } = mongoose;

const connectDB = async () => {
    try {
        useNewUrlParser;
        useUnifiedTopology;
        await connect(process.env.DB_URL);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
};

export default connectDB;
