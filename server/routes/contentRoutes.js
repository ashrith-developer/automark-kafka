import express from 'express';
import { generateContent, getHistory, getContentById, deleteContent } from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateContent);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getContentById);
router.delete('/:id', protect, deleteContent);

export default router;
