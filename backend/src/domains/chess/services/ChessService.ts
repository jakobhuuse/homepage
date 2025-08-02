import { Repository } from 'typeorm';
import { ChessGame, GameStatus, PieceColor } from '../models/ChessGame';
import { CreateGameDto, JoinGameDto, MakeMoveDto, GameStateDto, ChessMove, ChessBoard } from '../types';
import { AppDataSource } from '../../../config/data-source';
import { ChessGameLogic } from '../utils/ChessGameLogic';
import { randomBytes } from 'crypto';

export class ChessService {
  private gameRepository: Repository<ChessGame>;

  constructor() {
    this.gameRepository = AppDataSource.getRepository(ChessGame);
  }

  private generateInviteCode(): string {
    return randomBytes(6).toString('hex').toUpperCase();
  }

  async createGame(createGameDto: CreateGameDto): Promise<GameStateDto> {
    const inviteCode = this.generateInviteCode();
    const initialBoard = ChessGameLogic.getInitialBoard();
    
    const game = this.gameRepository.create({
      inviteCode,
      whitePlayerId: randomBytes(16).toString('hex'), // Generate anonymous player ID
      whitePlayerName: createGameDto.playerName,
      status: GameStatus.WAITING,
      currentTurn: PieceColor.WHITE,
      boardState: JSON.stringify(initialBoard),
      moveHistory: JSON.stringify([]),
      isCheck: false,
      isCheckmate: false,
      isStalemate: false
    });

    const savedGame = await this.gameRepository.save(game);
    return this.mapToGameStateDto(savedGame);
  }

  async joinGame(joinGameDto: JoinGameDto): Promise<GameStateDto> {
    const game = await this.gameRepository.findOne({
      where: { inviteCode: joinGameDto.inviteCode }
    });

    if (!game) {
      throw new Error('Game not found');
    }

    if (game.status !== GameStatus.WAITING) {
      throw new Error('Game is not available for joining');
    }

    if (game.blackPlayerId) {
      throw new Error('Game is already full');
    }

    game.blackPlayerId = randomBytes(16).toString('hex');
    game.blackPlayerName = joinGameDto.playerName;
    game.status = GameStatus.IN_PROGRESS;

    const updatedGame = await this.gameRepository.save(game);
    return this.mapToGameStateDto(updatedGame);
  }

  async getGameByInviteCode(inviteCode: string): Promise<GameStateDto | null> {
    const game = await this.gameRepository.findOne({
      where: { inviteCode }
    });

    return game ? this.mapToGameStateDto(game) : null;
  }

  async getGameById(gameId: string): Promise<GameStateDto | null> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId }
    });

    return game ? this.mapToGameStateDto(game) : null;
  }

  async makeMove(gameId: string, playerId: string, moveDto: MakeMoveDto): Promise<GameStateDto> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId }
    });

    if (!game) {
      throw new Error('Game not found');
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error('Game is not in progress');
    }

    // Verify it's the player's turn
    const isWhitePlayer = game.whitePlayerId === playerId;
    const isBlackPlayer = game.blackPlayerId === playerId;
    
    if (!isWhitePlayer && !isBlackPlayer) {
      throw new Error('Player not in this game');
    }

    const expectedColor = isWhitePlayer ? PieceColor.WHITE : PieceColor.BLACK;
    if (game.currentTurn !== expectedColor) {
      throw new Error('Not your turn');
    }

    const boardState: ChessBoard = JSON.parse(game.boardState);
    const moveHistory: ChessMove[] = JSON.parse(game.moveHistory);

    // Validate move
    if (!ChessGameLogic.isValidMove(boardState, moveDto.from, moveDto.to, game.currentTurn)) {
      throw new Error('Invalid move');
    }

    // Make the move
    const piece = boardState[moveDto.from];
    const capturedPiece = boardState[moveDto.to];
    const newBoardState = ChessGameLogic.makeMove(boardState, moveDto.from, moveDto.to);

    // Handle pawn promotion
    if (piece?.type === 'pawn' && moveDto.promotion) {
      const promotionRow = piece.color === PieceColor.WHITE ? 7 : 0;
      const toPosition = ChessGameLogic.squareToPosition(moveDto.to);
      
      if (toPosition.row === promotionRow) {
        newBoardState[moveDto.to] = {
          type: moveDto.promotion as any,
          color: piece.color
        };
      }
    }

    // Check game state
    const opponentColor = game.currentTurn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
    const isCheck = ChessGameLogic.isInCheck(newBoardState, opponentColor);
    const isCheckmate = ChessGameLogic.isCheckmate(newBoardState, opponentColor);
    const isStalemate = ChessGameLogic.isStalemate(newBoardState, opponentColor);

    // Create move record
    const move: ChessMove = {
      from: moveDto.from,
      to: moveDto.to,
      piece: piece!,
      capturedPiece: capturedPiece || undefined,
      isCheck,
      isCheckmate,
      isStalemate,
      timestamp: new Date(),
      moveNumber: moveHistory.length + 1,
      promotion: moveDto.promotion
    };

    moveHistory.push(move);

    // Update game state
    game.boardState = JSON.stringify(newBoardState);
    game.moveHistory = JSON.stringify(moveHistory);
    game.currentTurn = opponentColor;
    game.isCheck = isCheck;
    game.isCheckmate = isCheckmate;
    game.isStalemate = isStalemate;

    if (isCheckmate) {
      game.status = GameStatus.COMPLETED;
      game.winner = game.currentTurn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
    } else if (isStalemate) {
      game.status = GameStatus.COMPLETED;
      game.winner = null; // Draw
    }

    const updatedGame = await this.gameRepository.save(game);
    return this.mapToGameStateDto(updatedGame);
  }

  async abandonGame(gameId: string, playerId: string): Promise<void> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId }
    });

    if (!game) {
      throw new Error('Game not found');
    }

    const isPlayer = game.whitePlayerId === playerId || game.blackPlayerId === playerId;
    if (!isPlayer) {
      throw new Error('Player not in this game');
    }

    game.status = GameStatus.ABANDONED;
    
    // Set winner as the other player if game was in progress
    if (game.whitePlayerId === playerId) {
        game.winner = PieceColor.BLACK;
    } else {
      game.winner = PieceColor.WHITE;
    }
    

    await this.gameRepository.save(game);
  }

  private mapToGameStateDto(game: ChessGame): GameStateDto {
    return {
      id: game.id,
      inviteCode: game.inviteCode,
      whitePlayerId: game.whitePlayerId,
      blackPlayerId: game.blackPlayerId,
      whitePlayerName: game.whitePlayerName,
      blackPlayerName: game.blackPlayerName,
      status: game.status,
      currentTurn: game.currentTurn,
      boardState: JSON.parse(game.boardState),
      moveHistory: JSON.parse(game.moveHistory),
      winner: game.winner,
      isCheck: game.isCheck,
      isCheckmate: game.isCheckmate,
      isStalemate: game.isStalemate,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt
    };
  }
}