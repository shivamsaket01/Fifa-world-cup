import express from 'express';
import { getPrediction, submitPrediction, getLeaderboard, getUserPredictions } from '../controllers/predictionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.post('/', getPrediction);
router.post('/submit', protect, submitPrediction);
router.get('/me', protect, getUserPredictions);

export default router;
