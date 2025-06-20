import { Piece, Move, Board } from "./types";

export class MoveLogic {
  private board: Board;
  private selectedPiece: Piece | null = null;

  constructor(initialBoard: Board) {
    this.board = initialBoard;
  }

  selectPiece(row: number, col: number): Move[] | null {
    const piece = this.board[row][col];
    if (!piece) return null;

    this.selectedPiece = piece;
    return this.getValidMoves(row, col);
  }

  movePiece(toRow: number, toCol: number): boolean {
    if (!this.selectedPiece) return false;

    const validMoves = this.getValidMoves(this.selectedPiece.position.row, this.selectedPiece.position.col);
    const isValidMove = validMoves.some(move => move.row === toRow && move.col === toCol);

    if (isValidMove) {
      this.board[toRow][toCol] = this.selectedPiece;
      this.board[this.selectedPiece.position.row][this.selectedPiece.position.col] = null;
      this.selectedPiece.position = { row: toRow, col: toCol };
      this.selectedPiece = null;
      return true;
    }

    return false;
  }

  private getValidMoves(row: number, col: number): Move[] {
    // Implement logic to determine valid moves based on the piece type and current board state
    const moves: Move[] = [];
    // Example logic for a pawn (to be expanded for other pieces)
    const piece = this.board[row][col];
    if (piece.type === "pawn") {
      const direction = piece.color === "white" ? -1 : 1;
      const forwardMove = { row: row + direction, col: col };
      if (this.isInBounds(forwardMove) && !this.board[forwardMove.row][forwardMove.col]) {
        moves.push(forwardMove);
      }
      // Add logic for capturing moves and other piece types
    }
    return moves;
  }

  private isInBounds(move: Move): boolean {
    return move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8;
  }
}