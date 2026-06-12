import { Request, Response } from 'express';
import Team from '../models/Team';

export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getTeamById = async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
