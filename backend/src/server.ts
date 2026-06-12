import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db';
import { initSocketServer } from './sockets/socketServer';

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import matchRoutes from './routes/matchRoutes';
import teamRoutes from './routes/teamRoutes';
import standingRoutes from './routes/standingRoutes';
import newsRoutes from './routes/newsRoutes';
import predictionRoutes from './routes/predictionRoutes';

dotenv.config();
connectDB();

const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/standings', standingRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/predictions', predictionRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('GoalZone Backend API is running');
});

// Initialize Socket.io
initSocketServer(httpServer);

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
