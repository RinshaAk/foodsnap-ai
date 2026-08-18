import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-2.5-flash";
const DEFAULT_MIME_TYPE = "image/jpeg";

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};

export const analyzeFoodImage = async ({ buffer, mimeType }) => {
  if (!buffer) {
    throw new Error("Image file buffer is required");
  }

  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{
      role: "user",
      parts: [
        {
          inlineData: {
            data: buffer.toString("base64"),
            mimeType: mimeType || DEFAULT_MIME_TYPE,
          },
        },
        {
          text:
            "Analyze this food image for a nutrition logging app. " +
            "Identify every visible food item, estimate its portion size, estimated grams, calories, protein, carbohydrates, and fat. " +
            "Return only valid JSON with this exact shape: " +
            '{"foodName":"string","portionEstimate":"string","estimatedGrams":number,"calories":number,"protein":number,"carbohydrates":number,"fat":number,"confidence":number,"items":[{"foodName":"string","portionEstimate":"string","estimatedGrams":number,"calories":number,"protein":number,"carbohydrates":number,"fat":number,"confidence":number}]}. ' +
            "Use grams for protein, carbohydrates, and fat. Calories should be kcal. " +
            "For foodName at the top level, use a short meal name or combine item names. " +
            "If portion size cannot be measured exactly, provide a reasonable visual estimate and lower confidence.",
        },
      ],
    }],
    config: {
      responseMimeType: "application/json",
    },
  });

  return normalizeFoodAnalysis(response.text);
};

const normalizeFoodAnalysis = (text) => {
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  const parsed = JSON.parse(stripJsonMarkdown(text));
  const items = Array.isArray(parsed.items)
    ? parsed.items.map(normalizeFoodItem)
    : [];

  const totals = items.length > 0 ? totalItems(items) : parsed;

  return {
    foodName: parsed.foodName || "Unknown food",
    portionEstimate: parsed.portionEstimate || "Estimated from image",
    estimatedGrams: toNumber(totals.estimatedGrams),
    calories: toNumber(totals.calories),
    protein: toNumber(totals.protein),
    carbohydrates: toNumber(totals.carbohydrates),
    fat: toNumber(totals.fat),
    confidence: Number(parsed.confidence) || 0,
    items,
  };
};

const normalizeFoodItem = (item) => ({
  foodName: item.foodName || "Unknown food",
  portionEstimate: item.portionEstimate || "Estimated from image",
  estimatedGrams: toNumber(item.estimatedGrams),
  calories: toNumber(item.calories),
  protein: toNumber(item.protein),
  carbohydrates: toNumber(item.carbohydrates),
  fat: toNumber(item.fat),
  confidence: Number(item.confidence) || 0,
});

const totalItems = (items) => ({
  estimatedGrams: items.reduce((sum, item) => sum + item.estimatedGrams, 0),
  calories: items.reduce((sum, item) => sum + item.calories, 0),
  protein: items.reduce((sum, item) => sum + item.protein, 0),
  carbohydrates: items.reduce((sum, item) => sum + item.carbohydrates, 0),
  fat: items.reduce((sum, item) => sum + item.fat, 0),
});

const stripJsonMarkdown = (text) => (
  text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
);

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 10) / 10 : 0;
};
