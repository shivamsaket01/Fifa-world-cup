import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db';
import { initSocketServer } from './sockets/socketServer';
import cron from 'node-cron';
import { syncLiveMatches, syncDailyMatches } from './services/footballApiService';

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
app.use(cors({ 
  origin: true, 
  credentials: true 
}));
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
  res.send('Fifa World Cup 3.0 Backend API is running');
});

// Initialize Socket.io
initSocketServer(httpServer);

// Run daily sync on startup
setTimeout(() => {
  console.log('Running initial daily sync...');
  syncDailyMatches();
}, 5000); // 5 seconds after startup

// Start Automated Match Sync (Every 3 minutes for Live)
cron.schedule('*/3 * * * *', () => {
  syncLiveMatches();
});

// Daily schedule sync (Run at 00:00 every day)
cron.schedule('0 0 * * *', () => {
  syncDailyMatches();
});

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
