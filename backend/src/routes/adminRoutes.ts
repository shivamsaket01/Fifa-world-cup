import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { uploadFile, getAnalytics, createMatch, updateMatch, deleteMatch, getNews, createNews, updateNews, deleteNews } from '../controllers/adminController';

const router = express.Router();

router.use(protect, admin); // Apply to all routes

router.post('/upload', uploadFile);
router.get('/analytics', getAnalytics);

// Matches
router.post('/matches', createMatch);
router.put('/matches/:id', updateMatch);
router.delete('/matches/:id', deleteMatch);

// News
router.get('/news', getNews);
router.post('/news', createNews);
router.put('/news/:id', updateNews);
router.delete('/news/:id', deleteNews);

export default router;
