export const analyzeFoodService = async (file) => {
  if (!file) {
    throw new Error("Food image is required");
  }

  const prediction = await predictFood(file.path);

  const nutrition = await getNutritionData(
    prediction.food
  );

  return {
    food: prediction.food,
    confidence: prediction.confidence,
    nutrition,
  };
};