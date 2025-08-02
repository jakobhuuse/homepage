import { ChessBoard, ChessPiece, ChessPosition, PieceColor } from '../types';

export class ChessGameLogic {
  static getInitialBoard(): ChessBoard {
    const board: ChessBoard = {};
    
    // Initialize empty squares
    for (let row = 1; row <= 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = String.fromCharCode(97 + col) + row;
        board[square] = null;
      }
    }

    // White pieces
    board['a1'] = { type: 'rook', color: PieceColor.WHITE };
    board['b1'] = { type: 'knight', color: PieceColor.WHITE };
    board['c1'] = { type: 'bishop', color: PieceColor.WHITE };
    board['d1'] = { type: 'queen', color: PieceColor.WHITE };
    board['e1'] = { type: 'king', color: PieceColor.WHITE };
    board['f1'] = { type: 'bishop', color: PieceColor.WHITE };
    board['g1'] = { type: 'knight', color: PieceColor.WHITE };
    board['h1'] = { type: 'rook', color: PieceColor.WHITE };

    // White pawns
    for (let col = 0; col < 8; col++) {
      const square = String.fromCharCode(97 + col) + '2';
      board[square] = { type: 'pawn', color: PieceColor.WHITE };
    }

    // Black pieces
    board['a8'] = { type: 'rook', color: PieceColor.BLACK };
    board['b8'] = { type: 'knight', color: PieceColor.BLACK };
    board['c8'] = { type: 'bishop', color: PieceColor.BLACK };
    board['d8'] = { type: 'queen', color: PieceColor.BLACK };
    board['e8'] = { type: 'king', color: PieceColor.BLACK };
    board['f8'] = { type: 'bishop', color: PieceColor.BLACK };
    board['g8'] = { type: 'knight', color: PieceColor.BLACK };
    board['h8'] = { type: 'rook', color: PieceColor.BLACK };

    // Black pawns
    for (let col = 0; col < 8; col++) {
      const square = String.fromCharCode(97 + col) + '7';
      board[square] = { type: 'pawn', color: PieceColor.BLACK };
    }

    return board;
  }

  static squareToPosition(square: string): ChessPosition {
    return {
      col: square.charCodeAt(0) - 97, // 'a' = 0, 'b' = 1, etc.
      row: parseInt(square[1]) - 1     // '1' = 0, '2' = 1, etc.
    };
  }

  static positionToSquare(position: ChessPosition): string {
    return String.fromCharCode(97 + position.col) + (position.row + 1);
  }

  static isValidSquare(square: string): boolean {
    if (square.length !== 2) return false;
    const col = square.charCodeAt(0) - 97;
    const row = parseInt(square[1]) - 1;
    return col >= 0 && col <= 7 && row >= 0 && row <= 7;
  }

  static isValidMove(board: ChessBoard, from: string, to: string, currentTurn: PieceColor): boolean {
    if (!this.isValidSquare(from) || !this.isValidSquare(to)) return false;
    
    const piece = board[from];
    if (!piece || piece.color !== currentTurn) return false;
    
    const targetPiece = board[to];
    if (targetPiece && targetPiece.color === piece.color) return false;

    // Basic piece movement validation (simplified)
    return this.canPieceMoveTo(board, from, to, piece);
  }

  private static canPieceMoveTo(board: ChessBoard, from: string, to: string, piece: ChessPiece): boolean {
    const fromPos = this.squareToPosition(from);
    const toPos = this.squareToPosition(to);
    const deltaRow = toPos.row - fromPos.row;
    const deltaCol = toPos.col - fromPos.col;

    switch (piece.type) {
      case 'pawn':
        return this.isValidPawnMove(board, from, to, piece.color, deltaRow, deltaCol);
      case 'rook':
        return this.isValidRookMove(board, from, to, deltaRow, deltaCol);
      case 'bishop':
        return this.isValidBishopMove(board, from, to, deltaRow, deltaCol);
      case 'queen':
        return this.isValidQueenMove(board, from, to, deltaRow, deltaCol);
      case 'king':
        return this.isValidKingMove(deltaRow, deltaCol);
      case 'knight':
        return this.isValidKnightMove(deltaRow, deltaCol);
      default:
        return false;
    }
  }

  private static isValidPawnMove(board: ChessBoard, from: string, to: string, color: PieceColor, deltaRow: number, deltaCol: number): boolean {
    const direction = color === PieceColor.WHITE ? 1 : -1;
    const startRow = color === PieceColor.WHITE ? 1 : 6;
    const fromPos = this.squareToPosition(from);
    const targetPiece = board[to];

    // Forward move
    if (deltaCol === 0) {
      if (targetPiece) return false; // Can't capture forward
      if (deltaRow === direction) return true; // One square forward
      if (deltaRow === 2 * direction && fromPos.row === startRow) return true; // Two squares from start
    }
    
    // Diagonal capture
    if (Math.abs(deltaCol) === 1 && deltaRow === direction) {
      return targetPiece !== null && targetPiece.color !== color;
    }

    return false;
  }

  private static isValidRookMove(board: ChessBoard, from: string, to: string, deltaRow: number, deltaCol: number): boolean {
    if (deltaRow !== 0 && deltaCol !== 0) return false; // Must move in straight line
    return this.isPathClear(board, from, to);
  }

  private static isValidBishopMove(board: ChessBoard, from: string, to: string, deltaRow: number, deltaCol: number): boolean {
    if (Math.abs(deltaRow) !== Math.abs(deltaCol)) return false; // Must move diagonally
    return this.isPathClear(board, from, to);
  }

  private static isValidQueenMove(board: ChessBoard, from: string, to: string, deltaRow: number, deltaCol: number): boolean {
    const isRookMove = deltaRow === 0 || deltaCol === 0;
    const isBishopMove = Math.abs(deltaRow) === Math.abs(deltaCol);
    if (!isRookMove && !isBishopMove) return false;
    return this.isPathClear(board, from, to);
  }

  private static isValidKingMove(deltaRow: number, deltaCol: number): boolean {
    return Math.abs(deltaRow) <= 1 && Math.abs(deltaCol) <= 1;
  }

  private static isValidKnightMove(deltaRow: number, deltaCol: number): boolean {
    return (Math.abs(deltaRow) === 2 && Math.abs(deltaCol) === 1) ||
           (Math.abs(deltaRow) === 1 && Math.abs(deltaCol) === 2);
  }

  private static isPathClear(board: ChessBoard, from: string, to: string): boolean {
    const fromPos = this.squareToPosition(from);
    const toPos = this.squareToPosition(to);
    const deltaRow = toPos.row - fromPos.row;
    const deltaCol = toPos.col - fromPos.col;

    const stepRow = deltaRow === 0 ? 0 : deltaRow / Math.abs(deltaRow);
    const stepCol = deltaCol === 0 ? 0 : deltaCol / Math.abs(deltaCol);

    let currentRow = fromPos.row + stepRow;
    let currentCol = fromPos.col + stepCol;

    while (currentRow !== toPos.row || currentCol !== toPos.col) {
      const square = this.positionToSquare({ row: currentRow, col: currentCol });
      if (board[square]) return false; // Path is blocked
      currentRow += stepRow;
      currentCol += stepCol;
    }

    return true;
  }

  static makeMove(board: ChessBoard, from: string, to: string): ChessBoard {
    const newBoard = { ...board };
    const piece = newBoard[from];
    
    if (piece) {
      newBoard[to] = piece;
      newBoard[from] = null;
    }
    
    return newBoard;
  }

  static isInCheck(board: ChessBoard, color: PieceColor): boolean {
    // Find the king
    let kingSquare = '';
    for (const square in board) {
      const piece = board[square];
      if (piece && piece.type === 'king' && piece.color === color) {
        kingSquare = square;
        break;
      }
    }

    if (!kingSquare) return false;

    // Check if any opponent piece can attack the king
    const opponentColor = color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
    for (const square in board) {
      const piece = board[square];
      if (piece && piece.color === opponentColor) {
        if (this.canPieceMoveTo(board, square, kingSquare, piece)) {
          return true;
        }
      }
    }

    return false;
  }

  static getAllValidMoves(board: ChessBoard, color: PieceColor): string[] {
    const validMoves: string[] = [];
    
    for (const from in board) {
      const piece = board[from];
      if (piece && piece.color === color) {
        for (const to in board) {
          if (this.isValidMove(board, from, to, color)) {
            // Check if move doesn't put own king in check
            const newBoard = this.makeMove(board, from, to);
            if (!this.isInCheck(newBoard, color)) {
              validMoves.push(`${from}-${to}`);
            }
          }
        }
      }
    }
    
    return validMoves;
  }

  static isCheckmate(board: ChessBoard, color: PieceColor): boolean {
    return this.isInCheck(board, color) && this.getAllValidMoves(board, color).length === 0;
  }

  static isStalemate(board: ChessBoard, color: PieceColor): boolean {
    return !this.isInCheck(board, color) && this.getAllValidMoves(board, color).length === 0;
  }
}