import axios from "axios";

const USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

const NUTRIENTS = {
  calories: {
    ids: [1008],
    names: ["energy"],
  },
  protein: {
    ids: [1003],
    names: ["protein"],
  },
  carbohydrates: {
    ids: [1005],
    names: ["carbohydrate"],
  },
  fat: {
    ids: [1004],
    names: ["total lipid", "fat"],
  },
};

export const refineWithNutritionDatabase = async (analysis) => {
  if (!process.env.USDA_API_KEY) {
    return {
      ...analysis,
      nutritionSource: "gemini_estimate",
    };
  }

  const sourceItems = analysis.items?.length
    ? analysis.items
    : [analysis];

  const refinedItems = await Promise.all(
    sourceItems.map((item) => refineFoodItem(item))
  );

  const hasDatabaseMatch = refinedItems.some((item) => item.nutritionReference);

  if (!analysis.items?.length) {
    return {
      ...analysis,
      ...refinedItems[0],
      nutritionSource: hasDatabaseMatch
        ? "gemini_plus_usda_fooddata_central"
        : "gemini_estimate",
      items: [],
    };
  }

  return {
    ...analysis,
    estimatedGrams: sum(refinedItems, "estimatedGrams"),
    calories: sum(refinedItems, "calories"),
    protein: sum(refinedItems, "protein"),
    carbohydrates: sum(refinedItems, "carbohydrates"),
    fat: sum(refinedItems, "fat"),
    nutritionSource: hasDatabaseMatch
      ? "gemini_plus_usda_fooddata_central"
      : "gemini_estimate",
    items: refinedItems,
  };
};

const refineFoodItem = async (item) => {
  const reference = await findNutritionReference(item.foodName);

  if (!reference || !item.estimatedGrams) {
    return item;
  }

  const scale = item.estimatedGrams / 100;

  return {
    ...item,
    calories: scaleNutrient(reference.per100g.calories, scale, item.calories),
    protein: scaleNutrient(reference.per100g.protein, scale, item.protein),
    carbohydrates: scaleNutrient(
      reference.per100g.carbohydrates,
      scale,
      item.carbohydrates
    ),
    fat: scaleNutrient(reference.per100g.fat, scale, item.fat),
    nutritionReference: reference,
  };
};

const findNutritionReference = async (foodName) => {
  if (!foodName || foodName === "Unknown food") {
    return null;
  }

  try {
    const { data } = await axios.get(USDA_SEARCH_URL, {
      params: {
        api_key: process.env.USDA_API_KEY,
        query: foodName,
        pageSize: 1,
      },
      timeout: 8000,
    });

    const food = data.foods?.[0];

    if (!food) {
      return null;
    }

    return {
      source: "USDA FoodData Central",
      fdcId: food.fdcId,
      description: food.description,
      per100g: extractNutrients(food.foodNutrients || []),
    };
  } catch (error) {
    return null;
  }
};

const extractNutrients = (foodNutrients) => ({
  calories: findNutrientValue(foodNutrients, NUTRIENTS.calories),
  protein: findNutrientValue(foodNutrients, NUTRIENTS.protein),
  carbohydrates: findNutrientValue(foodNutrients, NUTRIENTS.carbohydrates),
  fat: findNutrientValue(foodNutrients, NUTRIENTS.fat),
});

const findNutrientValue = (foodNutrients, matcher) => {
  const nutrient = foodNutrients.find((entry) => {
    const name = entry.nutrientName?.toLowerCase() || "";

    return (
      matcher.ids.includes(entry.nutrientId) ||
      matcher.names.some((expectedName) => name.includes(expectedName))
    );
  });

  return toNumber(nutrient?.value);
};

const scaleNutrient = (per100gValue, scale, fallbackValue) => {
  if (!per100gValue) {
    return toNumber(fallbackValue);
  }

  return toNumber(per100gValue * scale);
};

const sum = (items, key) => (
  toNumber(items.reduce((total, item) => total + toNumber(item[key]), 0))
);

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 10) / 10 : 0;
};
