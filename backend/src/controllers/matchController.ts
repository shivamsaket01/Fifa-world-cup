import { Request, Response } from 'express';
import Match from '../models/Match';

export const getAllMatches = async (req: Request, res: Response) => {
  try {
    const matches = await Match.find().populate('homeTeam').populate('awayTeam').sort({ date: 1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matches' });
  }
};

export const getLiveMatches = async (req: Request, res: Response) => {
  try {
    const matches = await Match.find({ status: 'LIVE' }).populate('homeTeam').populate('awayTeam');
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getUpcomingMatches = async (req: Request, res: Response) => {
  try {
    const matches = await Match.find({ status: 'NS' }).populate('homeTeam').populate('awayTeam');
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMatchById = async (req: Request, res: Response) => {
  try {
    const match = await Match.findById(req.params.id).populate('homeTeam').populate('awayTeam');
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getTodayMatches = async (req: Request, res: Response) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);

    const matches = await Match.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('homeTeam').populate('awayTeam').sort({ time: 1 });
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
