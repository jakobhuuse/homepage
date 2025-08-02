import { Request, Response, Router } from 'express';
import { ChessService } from '../services/ChessService';

const chessService = new ChessService();
const router = Router();

// Create a new game
router.post('/create', async (req: Request, res: Response) => {
    try {
        const { playerName } = req.body;
        
        if (!playerName) {
            res.status(400).json({ error: 'Player name is required' });
            return;
        }

        const gameState = await chessService.createGame({ playerName });
        res.status(201).json(gameState);
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ error: 'Failed to create game' });
    }
});

// Join a game by invite code
router.post('/join', async (req: Request, res: Response) => {
    try {
        const { inviteCode, playerName } = req.body;
        
        if (!inviteCode || !playerName) {
            res.status(400).json({ error: 'Invite code and player name are required' });
            return;
        }

        const gameState = await chessService.joinGame({ inviteCode, playerName });
        
        // Notify via WebSocket that a player joined (if WebSocket service is available)
        const wsService = (global as any).wsService;
        if (wsService) {
            wsService.notifyPlayerJoined(gameState.id, playerName, gameState.blackPlayerId!);
            wsService.notifyGameUpdate(gameState.id, gameState);
        }
        
        res.json(gameState);
    } catch (error) {
        console.error('Error joining game:', error);
        const message = error instanceof Error ? error.message : 'Failed to join game';
        res.status(400).json({ error: message });
    }
});

// Get game by invite code
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

// Get game by ID
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

// Make a move
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
                const winner = gameState.winner === 'white' ? gameState.whitePlayerName : gameState.blackPlayerName;
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

// Abandon game
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
                const winner = gameState.winner === 'white' ? gameState.whitePlayerName : gameState.blackPlayerName;
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