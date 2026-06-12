import { Request, Response } from 'express';
import Standing from '../models/Standing';

export const getStandings = async (req: Request, res: Response) => {
  try {
    const standings = await Standing.find().populate('team');
    res.json(standings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
