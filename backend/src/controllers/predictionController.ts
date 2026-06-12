import { Request, Response } from 'express';
import { aiService } from '../services/aiService';
import Team from '../models/Team';

export const getPrediction = async (req: Request, res: Response) => {
  try {
    const { teamAId, teamBId } = req.body;

    if (!teamAId || !teamBId) {
      return res.status(400).json({ message: 'Please provide both team IDs' });
    }

    const teamA = await Team.findById(teamAId);
    const teamB = await Team.findById(teamBId);

    if (!teamA || !teamB) {
      return res.status(404).json({ message: 'One or both teams not found' });
    }

    // Call the Gemini AI Service
    const prediction = await aiService.predictMatch(teamA.name, teamB.name);

    res.json({
      teamA: teamA.name,
      teamB: teamB.name,
      prediction,
    });
  } catch (error) {
    console.error('Prediction Error:', error);
    res.status(500).json({ message: 'Failed to generate prediction' });
  }
};
