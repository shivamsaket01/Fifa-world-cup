import express from 'express';
import { getStandings } from '../controllers/standingController';

const router = express.Router();

router.get('/', getStandings);

export default router;
