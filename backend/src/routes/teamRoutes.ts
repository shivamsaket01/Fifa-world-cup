import express from 'express';
import { getTeams, getTeamById } from '../controllers/teamController';

const router = express.Router();

router.get('/', getTeams);
router.get('/:id', getTeamById);

export default router;
