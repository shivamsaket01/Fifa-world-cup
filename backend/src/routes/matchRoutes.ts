import express from 'express';
import { getLiveMatches, getUpcomingMatches, getMatchById } from '../controllers/matchController';

const router = express.Router();

router.get('/live', getLiveMatches);
router.get('/upcoming', getUpcomingMatches);
router.get('/:id', getMatchById);

export default router;
