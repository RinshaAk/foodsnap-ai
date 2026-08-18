import { analyzeFoodImage } from "./geminiService.js";
import { refineWithNutritionDatabase } from "./nutritionService.js";
import FoodHistory from "../models/FoodHistory.js";

export const analyzeFoodService = async (file, userId = null) => {
  if (!file) {
    throw new Error("Food image is required");
  }

  const geminiResult = await analyzeFoodImage({
    buffer: file.buffer,
    mimeType: file.mimetype,
  });

  const result = await refineWithNutritionDatabase(geminiResult);

  if (userId) {
    const history = await FoodHistory.create({
      user: userId,
      foodName: result.foodName,
      portionEstimate: result.portionEstimate,
      estimatedGrams: result.estimatedGrams,
      calories: result.calories,
      protein: result.protein,
      carbohydrates: result.carbohydrates,
      fat: result.fat,
      confidence: result.confidence,
      nutritionSource: result.nutritionSource,
      items: result.items,
    });

    return {
      ...result,
      historyId: history._id,
    };
  }

  return result;
};
