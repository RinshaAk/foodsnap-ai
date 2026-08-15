import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";

const MODEL = "gemini-2.5-flash";

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};

export const analyzeFoodImage = async (filePath) => {
  if (!filePath) {
    throw new Error("Image file is required");
  }

  const ai = getGeminiClient();
  const imageBuffer = await fs.readFile(filePath);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: getMimeType(filePath),
        },
      },
      {
        text:
          "Analyze this food image and return only JSON with this shape: " +
          '{"foodName":"string","calories":number,"protein":number,"carbohydrates":number,"fat":number,"confidence":number}. ' +
          "Use grams for protein, carbohydrates, and fat. If unsure, provide your best estimate.",
      },
    ],
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

  const parsed = JSON.parse(text);

  return {
    foodName: parsed.foodName || "Unknown food",
    calories: Number(parsed.calories) || 0,
    protein: Number(parsed.protein) || 0,
    carbohydrates: Number(parsed.carbohydrates) || 0,
    fat: Number(parsed.fat) || 0,
    confidence: Number(parsed.confidence) || 0,
  };
};

const getMimeType = (filePath) => {
  const extension = filePath
    .split(".")
    .pop()
    ?.toLowerCase();

  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };

  return mimeTypes[extension] || "image/jpeg";
};
