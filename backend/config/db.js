import mongoose from "mongoose";
import dns from "dns";
// dns.setServers(["8.8.8.8", "1.1.1.1"]);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error.message);
  }
};

export default connectDB;
