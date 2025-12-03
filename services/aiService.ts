import { PlantAnalysisResult } from "../types";
import { analyzeWithGemini } from "./geminiService";
import { analyzeWithOpenAI } from "./openaiService";

/**
 * Analyzes a plant image using the configured AI provider.
 * Prioritizes OpenAI if API_KEY_OPENAI is present, otherwise falls back to Gemini.
 */
export const analyzePlantImage = async (
  imageFile: File,
  additionalContext?: string
): Promise<PlantAnalysisResult> => {
  // Check for OpenAI key first
  if (process.env.API_KEY_OPENAI) {
    console.log("Using OpenAI provider");
    return analyzeWithOpenAI(imageFile, additionalContext);
  }

  // Fallback to Gemini
  if (process.env.API_KEY) {
    console.log("Using Gemini provider");
    return analyzeWithGemini(imageFile, additionalContext);
  }

  throw new Error("No valid API Key found. Please configure API_KEY (Gemini) or API_KEY_OPENAI.");
};
