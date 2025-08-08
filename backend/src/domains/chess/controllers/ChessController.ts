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
    try {
        const gameState = await chessService.createGame();
        res.status(201).json(gameState);
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ error: 'Failed to create game' });
    }
});

/**
 * @swagger
 * /chess/join:
 *   post:
 *     summary: Join an existing game by invite code
 *     tags: [Chess]
 *     requestBody:
 *       description: Invite code
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JoinGameDto'
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
 *                   example: Invite code is required
 */
router.post('/join', async (req: Request, res: Response) => {
    try {
        const { inviteCode} = req.body;
        
        if (!inviteCode) {
            res.status(400).json({ error: 'Invite code is required' });
            return;
        }

        const gameState = await chessService.joinGame({ inviteCode });
        
        // Notify via WebSocket that a player joined (if WebSocket service is available)
        const wsService = (global as any).wsService;
        if (wsService) {
            wsService.notifyPlayerJoined(gameState.id, gameState.blackPlayerId!);
            wsService.notifyGameUpdate(gameState.id, gameState);
        }
        
        res.json(gameState);
    } catch (error) {
        console.error('Error joining game:', error);
        const message = error instanceof Error ? error.message : 'Failed to join game';
        res.status(400).json({ error: message });
    }
});

/**
 * @swagger
 * /chess/invite/{inviteCode}:
 *   get:
 *     summary: Get game details using an invite code
 *     tags: [Chess]
 *     parameters:
 *       - in: path
 *         name: inviteCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique invite code for the game
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
router.get('/invite/:inviteCode', async (req: Request, res: Response) => {
    try {
        const { inviteCode } = req.params;
        const gameState = await chessService.getGameByInviteCode(inviteCode);
        
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

/**
 * @swagger
 * /chess/{gameId}:
 *   get:
 *     summary: Get game details by game ID
 *     tags: [Chess]
 *     parameters:
 *       - in: path
 *         name: gameId
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
router.get('/:gameId', async (req: Request, res: Response) => {
    try {
        const { gameId } = req.params;
        const gameState = await chessService.getGameById(gameId);
        
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

/**
 * @swagger
 * /chess/{gameId}/move:
 *   post:
 *     summary: Make a move in a game
 *     tags: [Chess]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the game
 *     requestBody:
 *       description: Move details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [playerId, from, to]
 *             properties:
 *               playerId:
 *                 type: string
 *                 example: player123
 *               from:
 *                 type: string
 *                 example: e2
 *               to:
 *                 type: string
 *                 example: e4
 *               promotion:
 *                 type: string
 *                 enum: [q, r, b, n]
 *                 example: q
 *     responses:
 *       200:
 *         description: Move processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameStateDto'
 *       400:
 *         description: Invalid move data / Failed to make move
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid move data
 */
router.post('/:gameId/move', async (req: Request, res: Response) => {
    try {
        const { gameId } = req.params;
        const { playerId, from, to, promotion } = req.body;
        
        if (!playerId || !from || !to) {
            res.status(400).json({ error: 'Player ID, from, and to positions are required' });
            return;
        }

        const gameState = await chessService.makeMove(gameId, playerId, { from, to, promotion });
        
        // Get the last move from history
        const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
        
        // Notify via WebSocket (if available)
        const wsService = (global as any).wsService;
        if (wsService) {
            wsService.notifyMoveMade(gameId, lastMove, gameState);
            
            // Check if game ended
            if (gameState.isCheckmate) {
                const winner = gameState.winner;
                wsService.notifyGameEnded(gameId, winner, 'checkmate');
            } else if (gameState.isStalemate) {
                wsService.notifyGameEnded(gameId, null, 'stalemate');
            }
        }
        
        res.json(gameState);
    } catch (error) {
        console.error('Error making move:', error);
        const message = error instanceof Error ? error.message : 'Failed to make move';
        res.status(400).json({ error: message });
    }
});

/**
 * @swagger
 * /chess/{gameId}/abandon:
 *   post:
 *     summary: Abandon a game
 *     tags: [Chess]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the game to abandon
 *     requestBody:
 *       description: Player abandoning the game
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [playerId]
 *             properties:
 *               playerId:
 *                 type: string
 *                 example: player123
 *     responses:
 *       204:
 *         description: Game abandoned successfully
 *       400:
 *         description: Player ID is required / Failed to abandon game
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Player ID is required
 */
router.post('/:gameId/abandon', async (req: Request, res: Response) => {
    try {
        const { gameId } = req.params;
        const { playerId } = req.body;
        
        if (!playerId) {
            res.status(400).json({ error: 'Player ID is required' });
            return;
        }

        await chessService.abandonGame(gameId, playerId);
        
        // Get updated game state to send via WebSocket (if available)
        const wsService = (global as any).wsService;
        if (wsService) {
            const gameState = await chessService.getGameById(gameId);
            if (gameState) {
                const winner = gameState.winner;
                wsService.notifyGameEnded(gameId, winner, 'abandoned');
            }
        }
        
        res.status(204).send();
    } catch (error) {
        console.error('Error abandoning game:', error);
        const message = error instanceof Error ? error.message : 'Failed to abandon game';
        res.status(400).json({ error: message });
    }
});

export { router as chessRoutes };