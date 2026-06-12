import { Request, Response } from 'express';
import Match from '../models/Match';
import Team from '../models/Team';
import Player from '../models/Player';
import News from '../models/News';
import User from '../models/User';
import { uploadImage } from '../services/uploadService';

// Mock Upload API
export const uploadFile = async (req: Request, res: Response) => {
  try {
    // We'd use multer here in a real app to get req.file.buffer
    const response = await uploadImage(Buffer.from(''), 'general');
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
};

// Analytics API
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const liveMatches = await Match.countDocuments({ status: 'LIVE' });
    const totalTeams = await Team.countDocuments();
    const totalPlayers = await Player.countDocuments();
    const totalNews = await News.countDocuments();

    res.json({
      totalUsers,
      liveMatches,
      totalTeams,
      totalPlayers,
      totalNews,
      visitors: 12450 // Mock stat
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

// --- Matches CRUD ---
export const createMatch = async (req: Request, res: Response) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ message: 'Invalid match data' });
  }
};

export const updateMatch = async (req: Request, res: Response) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(match);
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
};

export const updateLiveMatch = async (req: Request, res: Response) => {
  try {
    const { homeScore, awayScore, time, status } = req.body;
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { homeScore, awayScore, time, status },
      { new: true }
    ).populate('homeTeam').populate('awayTeam');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Broadcast to all clients
    import('../sockets/socketServer').then(({ getIO }) => {
      try {
        const io = getIO();
        io.emit('match_update', match);
      } catch (e) {
        console.error('Socket not initialized yet');
      }
    });

    // If match is finished, calculate prediction points
    if (status === 'FT') {
      const Prediction = require('../models/Prediction').default;
      const User = require('../models/User').default;
      
      const predictions = await Prediction.find({ match: match._id, pointsAwarded: null });
      
      for (const pred of predictions) {
        let points = 0;
        
        // Exact score: 3 points
        if (pred.homeScore === homeScore && pred.awayScore === awayScore) {
          points = 3;
        } 
        // Correct outcome (Home win, Away win, or Draw): 1 point
        else {
          const actualDiff = homeScore - awayScore;
          const predictedDiff = pred.homeScore - pred.awayScore;
          
          if ((actualDiff > 0 && predictedDiff > 0) || 
              (actualDiff < 0 && predictedDiff < 0) || 
              (actualDiff === 0 && predictedDiff === 0)) {
            points = 1;
          }
        }

        // Update prediction and user
        pred.pointsAwarded = points;
        await pred.save();
        
        if (points > 0) {
          await User.findByIdAndUpdate(pred.user, { $inc: { points: points } });
        }
      }
    }

    res.json(match);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update live match' });
  }
};

export const deleteMatch = async (req: Request, res: Response) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'Match deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Delete failed' });
  }
};

export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news' });
  }
};

export const createNews = async (req: Request, res: Response) => {
  try {
    const news = await News.create(req.body);
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ message: 'Invalid news data' });
  }
};

export const updateNews = async (req: Request, res: Response) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(news);
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Delete failed' });
  }
};
