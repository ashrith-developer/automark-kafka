import express from 'express';
import { registerUser, loginUser, googleLogin, getMe, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
// Logout is handled on the client side by removing the token
router.post('/logout', protect, (req, res) => res.json({ message: 'Logged out successfully' }));

export default router;
