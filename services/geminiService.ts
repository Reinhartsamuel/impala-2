import { GoogleGenAI } from "@google/genai";
import { OnboardingData, RiskProfileType } from '../types';

let genAI: GoogleGenAI | null = null;

const getAI = () => {
  if (!genAI) {
    // Robust check for process.env
    let apiKey: string | undefined = undefined;
    
    try {
      if (typeof process !== 'undefined' && process.env) {
        apiKey = process.env.API_KEY;
      }
    } catch (e) {
      console.warn("Could not access process.env", e);
    }
    
    if (apiKey) {
      genAI = new GoogleGenAI({ apiKey: apiKey });
    } else {
      console.warn("API_KEY not found. Gemini features disabled.");
    }
  }
  return genAI;
};

export const generateImpalaGreeting = async (
  profile: RiskProfileType,
  data: OnboardingData
): Promise<string> => {
  const ai = getAI();
  if (!ai) {
    return "Welcome to Impala! I've analyzed your profile and we're ready to start building your wealth empire.";
  }

  try {
    const prompt = `
      You are "Impala", a friendly, playful, and wise financial mascot for a DeFi app.
      The user has just completed onboarding.
      
      User Profile:
      - Risk Profile: ${profile}
      - Goal: ${data.goal}
      - Timeline: ${data.timeline}
      - Experience: ${data.defiExperience}
      - Reaction to -20% drop: ${data.volatilityReaction}

      Write a short, encouraging welcome message (max 2 sentences). 
      Be playful but reassuring. Use an emoji. 
      Mention their goal specifically.
      Do not use markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: prompt,
    });

    return response.text || "Welcome aboard! Let's reach your goals together! 🚀";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Welcome aboard! Let's reach your goals together! 🚀";
  }
};

export const getSmartTip = async (context: string): Promise<string> => {
    const ai = getAI();
    if (!ai) return "Keep your streak alive to maximize rewards! 🌟";

    try {
        const prompt = `
            You are "Impala", a DeFi guide. Give a very short (10 words max) playful tip about: ${context}.
            Use an emoji.
        `;
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-latest',
            contents: prompt,
        });
        return response.text || "Consistency is key to wealth! 🗝️";
    } catch (e) {
        return "Consistency is key to wealth! 🗝️";
    }
}