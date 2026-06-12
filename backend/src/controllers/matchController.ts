import { Request, Response } from 'express';
import Match from '../models/Match';

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
