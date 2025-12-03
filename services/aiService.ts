import { PlantAnalysisResult } from "../types";
import { analyzeWithGemini } from "./geminiService";
import { analyzeWithOpenAI } from "./openaiService";

// Helper to safely get env vars in browser environments (Vite, CRA, etc.)
// preventing "process is not defined" crashes.
const getEnvVar = (keys: string[]): string | undefined => {
  // 1. Try Vite (import.meta.env)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      for (const key of keys) {
        // @ts-ignore
        const val = import.meta.env[key] || import.meta.env[`VITE_${key}`];
        if (val) return val;
      }
    }
  } catch (e) {}

  // 2. Try Standard (process.env)
  try {
    if (typeof process !== 'undefined' && process.env) {
      for (const key of keys) {
        const val = process.env[key];
        if (val) return val;
      }
    }
  } catch (e) {}

  return undefined;
};

/**
 * Analyzes a plant image using the configured AI provider.
 * Prioritizes OpenAI if API_KEY_OPENAI is present, otherwise falls back to Gemini.
 */
export const analyzePlantImage = async (
  imageFile: File,
  additionalContext?: string
): Promise<PlantAnalysisResult> => {
  // Check for OpenAI key first (supports VITE_ prefix and standard)
  const openAIKey = getEnvVar(['API_KEY_OPENAI', 'OPENAI_API_KEY']);
  if (openAIKey) {
    console.log("Using OpenAI provider");
    return analyzeWithOpenAI(imageFile, additionalContext);
  }

  // Fallback to Gemini
  const geminiKey = getEnvVar(['API_KEY', 'GOOGLE_API_KEY']);
  if (geminiKey) {
    console.log("Using Gemini provider");
    return analyzeWithGemini(imageFile, additionalContext);
  }

  throw new Error("No valid API Key found. Please configure API_KEY_OPENAI or API_KEY in your environment variables.");
};