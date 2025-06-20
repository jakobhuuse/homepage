export type PieceColor = "w" | "b";
export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";

export type ChessPiece = {
  color: PieceColor;
  type: PieceType;
  src: string;
  alt: string;
};

// Optionally, create a mapping for all pieces:
export const pieceData: Record<`${PieceColor}_${PieceType}`, ChessPiece> = {
  b_king:   { color: "b", type: "king",   src: "/games/chess/pieces/king-b.svg",   alt: "Black King" },
  b_queen:  { color: "b", type: "queen",  src: "/games/chess/pieces/queen-b.svg",  alt: "Black Queen" },
  b_rook:   { color: "b", type: "rook",   src: "/games/chess/pieces/rook-b.svg",   alt: "Black Rook" },
  b_bishop: { color: "b", type: "bishop", src: "/games/chess/pieces/bishop-b.svg", alt: "Black Bishop" },
  b_knight: { color: "b", type: "knight", src: "/games/chess/pieces/knight-b.svg", alt: "Black Knight" },
  b_pawn:   { color: "b", type: "pawn",   src: "/games/chess/pieces/pawn-b.svg",   alt: "Black Pawn" },
  w_king:   { color: "w", type: "king",   src: "/games/chess/pieces/king-w.svg",   alt: "White King" },
  w_queen:  { color: "w", type: "queen",  src: "/games/chess/pieces/queen-w.svg",  alt: "White Queen" },
  w_rook:   { color: "w", type: "rook",   src: "/games/chess/pieces/rook-w.svg",   alt: "White Rook" },
  w_bishop: { color: "w", type: "bishop", src: "/games/chess/pieces/bishop-w.svg", alt: "White Bishop" },
  w_knight: { color: "w", type: "knight", src: "/games/chess/pieces/knight-w.svg", alt: "White Knight" },
  w_pawn:   { color: "w", type: "pawn",   src: "/games/chess/pieces/pawn-w.svg",   alt: "White Pawn" },
};