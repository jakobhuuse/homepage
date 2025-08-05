import { Router } from 'express';
import { chessRoutes } from '../../domains/chess/controllers/ChessController';

const router = Router();


router.use('/chess', chessRoutes);


/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns status of the API server.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default router;