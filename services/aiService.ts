import { PlantAnalysisResult } from "../types";
import { analyzeWithGemini } from "./geminiService";
import { analyzeWithOpenAI } from "./openaiService";
import { analyzeWithMock } from "./mockService";

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
 * Priority:
 * 1. OpenAI (if API_KEY_OPENAI is set)
 * 2. Gemini (if API_KEY is set)
 * 3. Mock/Demo (fallback if no keys are set, to prevent app crash)
 */
export const analyzePlantImage = async (
  imageFile: File,
  additionalContext?: string
): Promise<PlantAnalysisResult> => {
  // 1. Check for OpenAI
  const openAIKey = getEnvVar(['API_KEY_OPENAI', 'OPENAI_API_KEY']);
  if (openAIKey) {
    console.log("Using OpenAI provider");
    return analyzeWithOpenAI(imageFile, additionalContext);
  }

  // 2. Check for Gemini
  const geminiKey = getEnvVar(['API_KEY', 'GOOGLE_API_KEY']);
  if (geminiKey) {
    console.log("Using Gemini provider");
    return analyzeWithGemini(imageFile, additionalContext);
  }

  // 3. Fallback to Mock Service (Demo Mode)
  console.warn("No API Keys found (OpenAI/Gemini). Switching to Demo Mode.");
  return analyzeWithMock(imageFile, additionalContext);
};