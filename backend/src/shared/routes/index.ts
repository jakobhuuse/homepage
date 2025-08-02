import { Router } from 'express';
import { userRoutes } from '../../domains/users/controllers/UserController';
import { chessRoutes } from '../../domains/chess/controllers/ChessController';

const router = Router();

// User routes
router.use('/users', userRoutes);

// Chess routes
router.use('/chess', chessRoutes);

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default router;