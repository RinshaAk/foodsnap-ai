import express from "express";

import {
  getHistory,
  getHistoryById,
  deleteHistory,
} from "../controllers/historyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getHistory);
router.get("/:id", getHistoryById);
router.delete("/:id", deleteHistory);

export default router;
