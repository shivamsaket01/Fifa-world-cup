import { GoogleGenerativeAI } from '@google/generative-ai';

export interface Prediction {
  homeWinProbability: number;
  awayWinProbability: number;
  drawProbability: number;
  predictedScore: string;
  analysis: string;
}

export interface AIProvider {
  predictMatch(teamA: string, teamB: string, context?: any): Promise<Prediction>;
  generateNews(summary: string): Promise<string>;
}

export class GeminiAIProvider implements AIProvider {
  private ai: GoogleGenerativeAI;
  private model: any;

  constructor() {
    // Requires GEMINI_API_KEY in .env
    this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async predictMatch(teamA: string, teamB: string, context?: any): Promise<Prediction> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not configured');
      }

      const prompt = `
        You are an expert football analyst. Predict the outcome of a match between ${teamA} and ${teamB}.
        Consider any historical context or recent form.
        Return ONLY a JSON object with the following structure, nothing else:
        {
          "homeWinProbability": 40,
          "awayWinProbability": 30,
          "drawProbability": 30,
          "predictedScore": "1-1",
          "analysis": "Brief 2-sentence analysis here."
        }
      `;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      
      // Clean up markdown formatting if Gemini returns it
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson) as Prediction;
    } catch (error) {
      console.error('Gemini API Error:', error);
      // Fallback response if API fails or key is missing
      return {
        homeWinProbability: 33,
        awayWinProbability: 33,
        drawProbability: 34,
        predictedScore: "0-0",
        analysis: "Prediction unavailable at this time."
      };
    }
  }

  async generateNews(summary: string): Promise<string> {
    try {
      if (!process.env.GEMINI_API_KEY) return `Generated article based on: ${summary}`;
      
      const prompt = `Write a professional 3-paragraph sports news article expanding on this summary: "${summary}"`;
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      return `Failed to generate article based on: ${summary}`;
    }
  }
}

// Export a singleton instance
export const aiService = new GeminiAIProvider();
