/**
 * @swagger
 * components:
 *   schemas:
 *     GameStatus:
 *       type: string
 *       enum:
 *         - waiting
 *         - in_progress
 *         - completed
 *         - abandoned
 *       example: waiting
 */
export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PieceColor:
 *       type: string
 *       enum:
 *         - white
 *         - black
 *       example: white
 */
export enum PieceColor {
  WHITE = 'white',
  BLACK = 'black'
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateGameDto:
 *       type: object
 *       required:
 *         - playerName
 *       properties:
 *         playerName:
 *           type: string
 *           example: "Alice"
 */
export interface CreateGameDto {
  playerName: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     JoinGameDto:
 *       type: object
 *       required:
 *         - inviteCode
 *         - playerName
 *       properties:
 *         inviteCode:
 *           type: string
 *           example: "ABC123"
 *         playerName:
 *           type: string
 *           example: "Bob"
 */
export interface JoinGameDto {
  inviteCode: string;
  playerName: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     MakeMoveDto:
 *       type: object
 *       required:
 *         - from
 *         - to
 *       properties:
 *         from:
 *           type: string
 *           example: "a2"
 *         to:
 *           type: string
 *           example: "a4"
 *         promotion:
 *           type: string
 *           enum: [q, r, b, n]
 *           example: "q"
 */
export interface MakeMoveDto {
  from: string;
  to: string;
  promotion?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ChessPosition:
 *       type: object
 *       required:
 *         - row
 *         - col
 *       properties:
 *         row:
 *           type: integer
 *           example: 1
 *         col:
 *           type: integer
 *           example: 0
 */
export interface ChessPosition {
  row: number;
  col: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ChessPiece:
 *       type: object
 *       required:
 *         - type
 *         - color
 *       properties:
 *         type:
 *           type: string
 *           enum: [king, queen, rook, bishop, knight, pawn]
 *           example: "queen"
 *         color:
 *           $ref: '#/components/schemas/PieceColor'
 */
export interface ChessPiece {
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  color: PieceColor;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ChessBoard:
 *       type: object
 *       additionalProperties:
 *         $ref: '#/components/schemas/ChessPiece'
 *         nullable: true
 *       example:
 *         a1:
 *           type: "rook"
 *           color: "white"
 *         a2: null
 */
export interface ChessBoard {
  [key: string]: ChessPiece | null;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ChessMove:
 *       type: object
 *       required:
 *         - from
 *         - to
 *         - piece
 *         - isCheck
 *         - isCheckmate
 *         - isStalemate
 *         - timestamp
 *         - moveNumber
 *       properties:
 *         from:
 *           type: string
 *           example: "e2"
 *         to:
 *           type: string
 *           example: "e4"
 *         piece:
 *           $ref: '#/components/schemas/ChessPiece'
 *         capturedPiece:
 *           $ref: '#/components/schemas/ChessPiece'
 *           nullable: true
 *         isCheck:
 *           type: boolean
 *           example: false
 *         isCheckmate:
 *           type: boolean
 *           example: false
 *         isStalemate:
 *           type: boolean
 *           example: false
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-08-05T12:34:56Z"
 *         moveNumber:
 *           type: integer
 *           example: 1
 *         promotion:
 *           type: string
 *           enum: [q, r, b, n]
 *           example: "q"
 *           nullable: true
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     GameStateDto:
 *       type: object
 *       required:
 *         - id
 *         - inviteCode
 *         - status
 *         - currentTurn
 *         - boardState
 *         - moveHistory
 *         - isCheck
 *         - isCheckmate
 *         - isStalemate
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           example: "game123"
 *         inviteCode:
 *           type: string
 *           example: "ABC123"
 *         whitePlayerId:
 *           type: string
 *           nullable: true
 *           example: "user1"
 *         blackPlayerId:
 *           type: string
 *           nullable: true
 *           example: "user2"
 *         whitePlayerName:
 *           type: string
 *           nullable: true
 *           example: "Alice"
 *         blackPlayerName:
 *           type: string
 *           nullable: true
 *           example: "Bob"
 *         status:
 *           $ref: '#/components/schemas/GameStatus'
 *         currentTurn:
 *           $ref: '#/components/schemas/PieceColor'
 *         boardState:
 *           $ref: '#/components/schemas/ChessBoard'
 *         moveHistory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ChessMove'
 *         winner:
 *           $ref: '#/components/schemas/PieceColor'
 *           nullable: true
 *         isCheck:
 *           type: boolean
 *           example: false
 *         isCheckmate:
 *           type: boolean
 *           example: false
 *         isStalemate:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-05T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-05T12:34:56Z"
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     WebSocketMessage:
 *       type: object
 *       required:
 *         - type
 *         - data
 *         - gameId
 *         - timestamp
 *       properties:
 *         type:
 *           type: string
 *           enum: [game_update, player_joined, move_made, game_ended, error]
 *           example: "game_update"
 *         data:
 *           type: object
 *         gameId:
 *           type: string
 *           example: "game123"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-08-05T12:34:56Z"
 */
export interface WebSocketMessage {
  type: 'game_update' | 'player_joined' | 'move_made' | 'game_ended' | 'error';
  data: any;
  gameId: string;
  timestamp: Date;
}
