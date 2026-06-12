import { Request, Response } from 'express';
import { aiService } from '../services/aiService';
import Team from '../models/Team';
import Match from '../models/Match';
import User from '../models/User';
import Prediction from '../models/Prediction';

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

export const submitPrediction = async (req: Request, res: Response) => {
  try {
    const { matchId, homeScore, awayScore } = req.body;
    // @ts-ignore
    const userId = req.user._id;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    if (match.status !== 'NS') {
      return res.status(400).json({ message: 'Match has already started' });
    }

    const prediction = await Prediction.findOneAndUpdate(
      { user: userId, match: matchId },
      { homeScore, awayScore },
      { new: true, upsert: true }
    );

    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit prediction' });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .sort({ points: -1 })
      .limit(50)
      .select('name avatar favoriteTeam points')
      .populate('favoriteTeam', 'name logo');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};

export const getUserPredictions = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const predictions = await Prediction.find({ user: req.user._id }).populate('match');
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch predictions' });
  }
};
