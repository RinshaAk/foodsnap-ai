import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
