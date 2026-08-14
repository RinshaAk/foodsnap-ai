import { scanFoodService } from "../services/foodService.js";

export const scanFood = async (req, res) => {
  try {
    const result = await scanFoodService();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};