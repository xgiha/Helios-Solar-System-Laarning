import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePlanetFact = async (planetName: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Please configure.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a short, fascinating, and scientific "Field Report" about the planet ${planetName}. Keep it under 50 words. Focus on a unique characteristic.`,
    });
    return response.text || "No data received.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to retrieve data at this moment.";
  }
};

export const chatWithAiGuide = async (history: {role: 'user' | 'model', text: string}[], message: string, contextPlanet: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are Helios, an advanced AI onboard a spaceship exploring the solar system. Currently, we are observing ${contextPlanet}. Answer the user's questions scientifically but concisely.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I didn't quite catch that.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Communication systems offline.";
  }
};

export const generatePlanetQuiz = async (planetName: string): Promise<QuizQuestion | null> => {
  if (!apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a fun and educational multiple-choice quiz question about the planet ${planetName} for a middle school student.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "correctIndex", "explanation"]
        }
      }
    });
    
    // The response is guaranteed to be a JSON string due to responseMimeType
    if (response.text) {
        return JSON.parse(response.text) as QuizQuestion;
    }
    return null;
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return null;
  }
};
