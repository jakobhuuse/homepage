import { ChessPiece, pieceData } from "./types";

export const initialBoard: (ChessPiece | null)[][] = [
    [
      pieceData.b_rook,
      pieceData.b_knight,
      pieceData.b_bishop,
      pieceData.b_queen,
      pieceData.b_king,
      pieceData.b_bishop,
      pieceData.b_knight,
      pieceData.b_rook,
    ],
    [
      pieceData.b_pawn,
      pieceData.b_pawn,
      pieceData.b_pawn,
      pieceData.b_pawn,
      pieceData.b_pawn,
      pieceData.b_pawn,
      pieceData.b_pawn,
      pieceData.b_pawn,
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
      pieceData.w_pawn,
      pieceData.w_pawn,
      pieceData.w_pawn,
      pieceData.w_pawn,
      pieceData.w_pawn,
      pieceData.w_pawn,
      pieceData.w_pawn,
      pieceData.w_pawn,
    ],
    [
      pieceData.w_rook,
      pieceData.w_knight,
      pieceData.w_bishop,
      pieceData.w_queen,
      pieceData.w_king,
      pieceData.w_bishop,
      pieceData.w_knight,
      pieceData.w_rook,
    ],
  ];

  export function getPossibleMoves(
    board: (ChessPiece | null)[][],
    row: number,
    col: number
  ): { row: number; col: number }[] {
    const piece = board[row][col];
    if (!piece) return [];

    const moves: { row: number; col: number }[] = [];
    
    if (piece.type === "pawn") {
      const direction = piece.color === "w" ? -1 : 1;
      if (board[row + direction][col] === null) {
        moves.push({ row: row + direction, col });
      }
    }

    //TODO: Implement other piece movement logic

    return moves;
  }