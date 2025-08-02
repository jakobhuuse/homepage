import { PieceColor, GameStatus } from './models/ChessGame';

export interface CreateGameDto {
  playerName: string;
}

export interface JoinGameDto {
  inviteCode: string;
  playerName: string;
}

export interface MakeMoveDto {
  from: string; // e.g., "a2"
  to: string;   // e.g., "a4"
  promotion?: string; // for pawn promotion: 'q', 'r', 'b', 'n'
}

export interface ChessPosition {
  row: number;
  col: number;
}

export interface ChessPiece {
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  color: PieceColor;
}

export interface ChessBoard {
  [key: string]: ChessPiece | null; // key format: "a1", "a2", etc.
}

export interface ChessMove {
  from: string;
  to: string;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  timestamp: Date;
  moveNumber: number;
  promotion?: string;
}

export interface GameStateDto {
  id: string;
  inviteCode: string;
  whitePlayerId: string | null;
  blackPlayerId: string | null;
  whitePlayerName: string | null;
  blackPlayerName: string | null;
  status: GameStatus;
  currentTurn: PieceColor;
  boardState: ChessBoard;
  moveHistory: ChessMove[];
  winner: PieceColor | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebSocketMessage {
  type: 'game_update' | 'player_joined' | 'move_made' | 'game_ended' | 'error';
  data: any;
  gameId: string;
  timestamp: Date;
}

export { PieceColor };
