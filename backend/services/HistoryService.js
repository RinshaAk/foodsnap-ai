import FoodHistory from "../models/FoodHistory.js";

export const getHistoryService = async (userId) => {
  const history = await FoodHistory.find({
    user: userId,
  }).sort({ createdAt: -1 });

  return history;
};

export const getHistoryByIdService = async (historyId, userId) => {
  const history = await FoodHistory.findOne({
    _id: historyId,
    user: userId,
  });

  if (!history) {
    throw new Error("Food history not found");
  }

  return history;
};

export const deleteHistoryService = async (historyId, userId) => {
  const history = await FoodHistory.findOneAndDelete({
    _id: historyId,
    user: userId,
  });

  if (!history) {
    throw new Error("Food history not found");
  }

  return history;
};