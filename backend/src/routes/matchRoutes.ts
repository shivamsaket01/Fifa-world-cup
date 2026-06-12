import express from 'express';
import { getLiveMatches, getUpcomingMatches, getMatchById, getAllMatches, getTodayMatches } from '../controllers/matchController';

const router = express.Router();

router.get('/', getAllMatches);
router.get('/today', getTodayMatches);
router.get('/live', getLiveMatches);
router.get('/upcoming', getUpcomingMatches);
router.get('/:id', getMatchById);

export default router;
