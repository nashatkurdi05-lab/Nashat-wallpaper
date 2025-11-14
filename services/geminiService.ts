import { GoogleGenAI, Modality } from "@google/genai";

const parseDataUri = (dataUri: string): { mimeType: string; data: string } => {
  const parts = dataUri.split(',');
  if (parts.length !== 2) {
    throw new Error('Invalid data URI format');
  }
  const metaPart = parts[0].split(';')[0];
  const mimeType = metaPart.substring(metaPart.indexOf(':') + 1);
  const data = parts[1];

  if (!mimeType || !data) {
    throw new Error('Could not parse data URI');
  }
  
  return { mimeType, data };
};

export const generateWallpaper = async (
  prompt: string,
  negativePrompt: string,
  aspectRatio: string,
  style: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let finalPrompt = `Generate a ${style} wallpaper of ${prompt.trim()}. The image must be high-resolution, ultra-detailed, and suitable for a desktop background. The aspect ratio must be exactly ${aspectRatio}.`;

  if (aspectRatio === '16:9') {
    finalPrompt += ` The final image resolution MUST be 1920x1080 pixels.`;
  }

  if (negativePrompt && negativePrompt.trim()) {
      finalPrompt += ` Do not include the following: ${negativePrompt.trim()}.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in the API response. The prompt may have been blocked.");
  } catch (error) {
    console.error("Error generating wallpaper:", error);
    throw new Error(error instanceof Error ? `Failed to generate wallpaper: ${error.message}` : "An unknown error occurred while generating the wallpaper.");
  }
};

export const upscaleWallpaper = async (
  imageDataUri: string,
  originalPrompt: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const { mimeType, data } = parseDataUri(imageDataUri);
    const imagePart = { inlineData: { mimeType, data } };
    const textPart = {
      text: `Upscale this image to a very high resolution (e.g., 4K), adding intricate details and enhancing realism while preserving the original composition and artistic style. For context, the original prompt was: "${originalPrompt}"`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
      config: { responseModalities: [Modality.IMAGE] },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No upscaled image data found in the API response. The prompt may have been blocked.");
  } catch (error) {
    console.error("Error upscaling wallpaper:", error);
    throw new Error(error instanceof Error ? `Failed to upscale wallpaper: ${error.message}` : "An unknown error occurred while upscaling the wallpaper.");
  }
};

export const enhanceImage = async (imageDataUri: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const { mimeType, data } = parseDataUri(imageDataUri);
        const imagePart = { inlineData: { mimeType, data } };
        const textPart = {
            text: "Enhance the quality of this image. Improve sharpness, clarity, color, and lighting. Fix any compression artifacts or noise. Make the image look professional and high-resolution, but do not change the subject, composition, or artistic style of the original image.",
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: { responseModalities: [Modality.IMAGE] },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No enhanced image data found in the API response.");
    } catch (error) {
        console.error("Error enhancing image:", error);
        throw new Error(error instanceof Error ? `Failed to enhance image: ${error.message}` : "An unknown error occurred while enhancing the image.");
    }
};