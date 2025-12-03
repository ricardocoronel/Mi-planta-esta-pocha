import { BOTANIST_PROMPT, PlantAnalysisResult } from "../types";
import { fileToBase64 } from "./geminiService";

const getOpenAIKey = (): string | undefined => {
  // 1. Try Vite (import.meta.env)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      const val = import.meta.env.API_KEY_OPENAI || import.meta.env.VITE_API_KEY_OPENAI || import.meta.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;
      if (val) return val;
    }
  } catch (e) {}

  // 2. Try Standard (process.env)
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY_OPENAI || process.env.OPENAI_API_KEY;
    }
  } catch (e) {}

  return undefined;
};

export const analyzeWithOpenAI = async (
  imageFile: File,
  additionalContext?: string
): Promise<PlantAnalysisResult> => {
  const API_KEY = getOpenAIKey();

  if (!API_KEY) {
    throw new Error("OpenAI API Key is missing. Please configure API_KEY_OPENAI.");
  }

  try {
    const base64Data = await fileToBase64(imageFile);
    
    const userPrompt = additionalContext 
      ? `Aquí tienes una foto de mi planta. Información extra: ${additionalContext}`
      : "Aquí tienes una foto de mi planta. Por favor analízala.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: BOTANIST_PROMPT
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${imageFile.type};base64,${base64Data}`
                }
              }
            ]
          }
        ],
        temperature: 0.4,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Parse the JSON block at the end for metadata
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    let meta = { healthScore: 50, confidence: 'medium' as const, identifiedName: 'Planta desconocida' };
    let cleanMarkdown = text;

    if (jsonMatch) {
      try {
        meta = JSON.parse(jsonMatch[1]);
        // Remove the JSON block from the display text
        cleanMarkdown = text.replace(jsonMatch[0], '').trim();
      } catch (e) {
        console.warn("Failed to parse metadata JSON from response", e);
      }
    }

    return {
      markdownText: cleanMarkdown,
      healthScore: meta.healthScore,
      confidence: meta.confidence as 'high' | 'medium' | 'low',
      identifiedName: meta.identifiedName
    };

  } catch (error: any) {
    console.error("Error analyzing plant with OpenAI:", error);
    throw new Error(error.message || "No se pudo conectar con el experto botánico (OpenAI).");
  }
};