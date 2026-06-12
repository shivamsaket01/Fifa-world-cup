import { Request, Response } from 'express';
import News from '../models/News';

export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
