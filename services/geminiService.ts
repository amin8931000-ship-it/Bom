
import { GoogleGenAI } from "@google/genai";
import { EnhancementParams } from "../types";

export class GeminiEnhancerService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  }

  /**
   * Encodes a File or Blob to base64 string
   */
  private async fileToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Enhances/Re-imagines an image using Gemini.
   * Note: While Gemini is not a dedicated super-resolution model, it can use generative 
   * capabilities to "re-imagine" an image based on the original content, effectively 
   * simulating high-end enhancement and artistic upscaling.
   */
  async enhanceImage(imageFile: File, params: EnhancementParams): Promise<string> {
    const base64Data = await this.fileToBase64(imageFile);
    
    const prompt = `
      Enhance and re-imagine this image with professional quality. 
      Parameters:
      - Style: ${params.model}
      - Creativity/Hallucination level: ${params.creativity} (0 is faithful, 1 is creative)
      - Face Enhancement: ${params.faceEnhancement ? 'Enabled' : 'Disabled'}
      - Target: ${params.subjectDetection}
      - Perceived Quality: Extremely high resolution, sharp details, cinematic lighting.
      
      Act as a world-class photo editor and digital artist. Restore details, fix artifacts, 
      and improve the overall visual impact while staying true to the original subject.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: imageFile.type,
              },
            },
            { text: prompt },
          ],
        },
      });

      // Find the image part in the response
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }

      throw new Error("No image data returned from AI");
    } catch (error) {
      console.error("Gemini Enhancement Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiEnhancerService();
