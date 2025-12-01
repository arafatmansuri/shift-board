import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
export const connectDB = async () => {
  try {
    const MONGODB_URI = <string>process.env.MONGODB_URI;
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    mongoose.disconnect();
    process.exit(1);
  }
};
