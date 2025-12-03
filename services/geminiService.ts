import { GoogleGenAI } from "@google/genai";
import { BOTANIST_PROMPT, PlantAnalysisResult } from "../types";
import { getEnv, fileToBase64 } from "../utils";

export const analyzeWithGemini = async (
  imageFile: File,
  additionalContext?: string
): Promise<PlantAnalysisResult> => {
  const API_KEY = getEnv(['API_KEY', 'GOOGLE_API_KEY']);

  if (!API_KEY) {
    throw new Error("Gemini API Key is missing. Please configure API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const base64Data = await fileToBase64(imageFile);
    
    const userPrompt = additionalContext 
      ? `Aquí tienes una foto de mi planta. Información extra: ${additionalContext}`
      : "Aquí tienes una foto de mi planta. Por favor analízala.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: BOTANIST_PROMPT,
        temperature: 0.4,
      },
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Data
            }
          },
          {
            text: userPrompt
          }
        ]
      }
    });

    const text = response.text || "";
    
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
    console.error("Error analyzing plant with Gemini:", error);
    throw new Error(error.message || "No se pudo conectar con el experto botánico (Gemini).");
  }
};
