import { Router } from 'express';
import { chessRoutes } from '../../domains/chess/controllers/ChessController';

const router = Router();


router.use('/chess', chessRoutes);

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default router;