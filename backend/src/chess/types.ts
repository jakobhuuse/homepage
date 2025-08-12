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
 *       properties:
 *         side:
 *           $ref: '#/components/schemas/PieceColor'
 *         
 */
export interface CreateGameDto {
  side: PieceColor | null
}

/**
 * @swagger
 * components:
 *   schemas:
 *     JoinGameDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           example: "ABC123"
 */
export interface JoinGameDto {
  id: string;
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
 *         - side
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
 *           example: "ABC123"
 *         side:
 *           $ref: '#/components/schemas/PieceColor'
 *           nullable: true
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
  side: PieceColor,
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
