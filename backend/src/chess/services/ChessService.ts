import { Repository } from 'typeorm';
import { ChessGame} from '../models/ChessGame';
import { CreateGameDto, GameStatus, PieceColor } from '../types';
import { JoinGameDto, GameStateDto, ChessMove, ChessBoard } from '../types';
import { AppDataSource } from '../../config/data-source';
import { ChessGameLogic } from '../utils/ChessGameLogic';
import { v4 as uuidv4 } from 'uuid';

export class ChessService {
  private gameRepository: Repository<ChessGame>;

  constructor() {
    this.gameRepository = AppDataSource.getRepository(ChessGame);
  }

  async createGame(createGameDto: CreateGameDto, playerId: string): Promise<GameStateDto> {
    const initialBoard = ChessGameLogic.getInitialBoard();

    let side: PieceColor;
    if (createGameDto.side === PieceColor.BLACK || createGameDto.side === PieceColor.WHITE) {
      side = createGameDto.side;
    } else {
      side = Math.random() < 0.5 ? PieceColor.BLACK : PieceColor.WHITE;
    }
    
    const game = this.gameRepository.create({
      blackPlayerId: side === PieceColor.BLACK ? playerId : null,
      whitePlayerId: side === PieceColor.WHITE ? playerId : null,
      status: GameStatus.WAITING,
      currentTurn: PieceColor.WHITE,
      boardState: JSON.stringify(initialBoard),
      moveHistory: JSON.stringify([]),
      isCheck: false,
      isCheckmate: false,
      isStalemate: false
    });

    const savedGame = await this.gameRepository.save(game);
    return this.mapToGameStateDto(savedGame, playerId)
  }

  async joinGame(joinGameDto: JoinGameDto, playerId: string): Promise<GameStateDto> {
    const game = await this.gameRepository.findOne({
      where: { id: joinGameDto.id }
    });

    if (!game) {
      throw new Error('Game not found');
    }

    if (game.status !== GameStatus.WAITING) {
      throw new Error('Game is not available for joining');
    }
  
    let side: PieceColor

    if (!game.whitePlayerId) {
      game.whitePlayerId = playerId;
      side = PieceColor.WHITE
    } else if (!game.blackPlayerId) {
      game.blackPlayerId = playerId;
      side = PieceColor.BLACK
    } else {
      throw new Error('Both player slots are already filled');
    }

    game.status = GameStatus.IN_PROGRESS;

    const updatedGame = await this.gameRepository.save(game);
    return this.mapToGameStateDto(updatedGame, playerId)
  }

  async getGameById(id: string, playerId: string): Promise<GameStateDto | null> {
    const game = await this.gameRepository.findOne({
      where: { id: id }
    });

    return game ? this.mapToGameStateDto(game, playerId) : null;
  }
  
  private mapToGameStateDto(game: ChessGame, playerId: string): GameStateDto {
    let side: PieceColor
    if (game.whitePlayerId === playerId) {
      side = PieceColor.WHITE
    } else if (game.blackPlayerId === playerId) {
      side = PieceColor.BLACK
    } else {
      side = null
    }

    return {
      id: game.id,
      side,
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