import express from 'express';
import { getPrediction } from '../controllers/predictionController';

const router = express.Router();

router.post('/', getPrediction);

export default router;
