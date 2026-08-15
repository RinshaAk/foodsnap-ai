import { analyzeFoodImage } from "./geminiService.js";

export const analyzeFoodService = async (file) => {
  if (!file) {
    throw new Error("Food image is required");
  }

  const result = await analyzeFoodImage(file.path);

  return result;
};
