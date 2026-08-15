import { analyzeFoodService } from "../services/foodService.js";

export const analyzeFood = async (req, res) => {
  try {
    if(!req.file){
      return res.status(400).json({
        success:false,
        message:"please upload a food image",
      });
    }
    const result = await analyzeFoodService(req.file);
    res.status(200).json({
      success: true,
      message: "Food image analyzed successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};