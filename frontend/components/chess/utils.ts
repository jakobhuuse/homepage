import { ChessPiece } from "@/app/api/generated/model";

export const getPieceImagePath = (piece: ChessPiece): string => {
  const color = piece.color === 'white' ? 'w' : 'b';
  return `/games/chess/pieces/${piece.type}-${color}.svg`;
};