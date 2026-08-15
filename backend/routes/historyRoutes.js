import express from "express";

import {
  getHistory,
  getHistoryById,
  deleteHistory,
} from "../controllers/historyController.js";

const router = express.Router();

router.get("/", getHistory);
router.get("/:id", getHistoryById);
router.delete("/:id", deleteHistory);

export default router;
