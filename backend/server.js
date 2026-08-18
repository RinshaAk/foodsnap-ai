import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import foodRoutes from "./routes/foodRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/food", foodRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FoodSnap AI API is running",
  });
});

app.use(errorHandler);

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
