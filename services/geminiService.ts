
import { GoogleGenAI } from "@google/genai";
import type { SimilarImage, GroundingChunk } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes the content of an image using the Gemini model.
 * @param imageBase64 The base64 encoded image data.
 * @param mimeType The MIME type of the image.
 * @returns A promise that resolves to a text description of the image.
 */
export const analyzeImage = async (imageBase64: string, mimeType: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    };

    const textPart = {
      text: "Descrivi questa immagine in dettaglio, concentrandoti sugli oggetti principali, l'ambientazione, i colori e l'atmosfera generale. Sii il più descrittivo possibile."
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image. Please check the console for more details.");
  }
};

/**
 * Finds web pages with similar images based on a text description using Google Search grounding.
 * @param description The text description to search for.
 * @returns A promise that resolves to an array of SimilarImage objects.
 */
export const findSimilarImages = async (description: string): Promise<SimilarImage[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Basandoti su questa descrizione, trova pagine web con immagini simili: "${description}"`,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.groundingChunks) {
      const chunks = groundingMetadata.groundingChunks as GroundingChunk[];
      return chunks
        .filter(chunk => chunk.web && chunk.web.uri && chunk.web.title)
        .map(chunk => ({
          uri: chunk.web.uri,
          title: chunk.web.title,
        }));
    }
    
    return [];
  } catch (error) {
    console.error("Error finding similar images:", error);
    throw new Error("Failed to find similar images. Please check the console for more details.");
  }
};
