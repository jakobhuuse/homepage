import { Request, Response, Router } from 'express';
import { ChessService } from '../services/ChessService';

const chessService = new ChessService();
const router = Router();

/**
 * @swagger
 * /chess/create:
 *   post:
 *     summary: Create a new chess game
 *     tags: [Chess]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGameDto'
 *     responses:
 *       201:
 *         description: Game created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameStateDto'
 *       500:
 *         description: Failed to create game
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to create game
 */
router.post('/create', async (req: Request, res: Response) => {
    const { side } = req.body;
    const guestId = (req as any).guestId
    try {
        const gameId = await chessService.createGame({ side }, guestId);
        res.status(201).json(gameId);
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ error: 'Failed to create game' });
    }
});

/**
 * @swagger
 * /chess/join/{id}:
 *   post:
 *     summary: Join an existing game by ID
 *     tags: [Chess]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the game
 *     responses:
 *       200:
 *         description: Joined game successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameStateDto'
 *       400:
 *         description: Failed to join game
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ID is required
 */
router.post('/join/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const guestId = (req as any).guestId
        
        if (!id) {
            res.status(400).json({ error: 'ID is required' });
            return;
        }

        const gameState = await chessService.joinGame({ id }, guestId);
        res.json(gameState);
    } catch (error) {
        console.error('Error joining game:', error);
        const message = error instanceof Error ? error.message : 'Failed to join game';
        res.status(400).json({ error: message });
    }
});

/**
 * @swagger
 * /chess/{id}:
 *   get:
 *     summary: Get game details by game ID
 *     tags: [Chess]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the game
 *     responses:
 *       200:
 *         description: Game found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameStateDto'
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Game not found
 *       500:
 *         description: Failed to fetch game
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch game
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const guestId = (req as any).guestId
        const gameState = await chessService.getGameById(id, guestId);
        
        if (!gameState) {
            res.status(404).json({ error: 'Game not found' });
            return;
        }
        
        res.json(gameState);
    } catch (error) {
        console.error('Error fetching game:', error);
        res.status(500).json({ error: 'Failed to fetch game' });
    }
});

export { router as chessRoutes };