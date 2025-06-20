import Image from "next/image";
import { useState } from "react";

type Piece = "b_rook" | "b_knight" | "b_bishop" | "b_queen" | "b_king" | "b_pawn" | "w_rook" | "w_knight" | "w_bishop" | "w_queen" | "w_king" | "w_pawn" | null;

const pieceToSvg: Record<string, string> = {
  b_rook: "rook-b.svg",
  b_knight: "knight-b.svg",
  b_bishop: "bishop-b.svg",
  b_queen: "queen-b.svg",
  b_king: "king-b.svg",
  b_pawn: "pawn-b.svg",
  w_rook: "rook-w.svg",
  w_knight: "knight-w.svg",
  w_bishop: "bishop-w.svg",
  w_queen: "queen-w.svg",
  w_king: "king-w.svg",
  w_pawn: "pawn-w.svg",
};

const initialBoard: (Piece)[][] = [
  [
    "b_rook",
    "b_knight",
    "b_bishop",
    "b_queen",
    "b_king",
    "b_bishop",
    "b_knight",
    "b_rook",
  ],
  [
    "b_pawn",
    "b_pawn",
    "b_pawn",
    "b_pawn",
    "b_pawn",
    "b_pawn",
    "b_pawn",
    "b_pawn",
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    "w_pawn",
    "w_pawn",
    "w_pawn",
    "w_pawn",
    "w_pawn",
    "w_pawn",
    "w_pawn",
    "w_pawn",
  ],
  [
    "w_rook",
    "w_knight",
    "w_bishop",
    "w_queen",
    "w_king",
    "w_bishop",
    "w_knight",
    "w_rook",
  ],
];

export default function Chessboard() {
  const [board, setBoard] = useState<Piece[][]>(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<{ row: number; col: number } | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<{ row: number; col: number }[]>([]);

  const handleSquareClick = (row: number, col: number) => {
    if (selectedPiece) {
      // Move logic here
      const newBoard = [...board];
      newBoard[row][col] = newBoard[selectedPiece.row][selectedPiece.col];
      newBoard[selectedPiece.row][selectedPiece.col] = null;
      setBoard(newBoard);
      setSelectedPiece(null);
      setPossibleMoves([]);
    } else {
      const piece = board[row][col];
      if (piece) {
        setSelectedPiece({ row, col });
        // Calculate possible moves based on the piece type
        const moves = calculatePossibleMoves(piece, row, col);
        setPossibleMoves(moves);
      }
    }
  };

  const calculatePossibleMoves = (piece: Piece, row: number, col: number) => {
    // Placeholder for actual move logic
    // This should return an array of possible move coordinates based on the piece type
    return [];
  };

  const rows = Array.from({ length: 8 }, (_, i) => i);
  const cols = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="aspect-square grid grid-cols-8 w-full">
      {rows.flatMap((row) =>
        cols.map((col) => {
          const isDark = (row + col) % 2 === 1;
          const piece = board[row][col];
          const pieceImageSrc = piece ? `/games/chess/pieces/${pieceToSvg[piece]}` : null;

          return (
            <div
              key={`${row}-${col}`}
              className={`w-full h-full flex items-center justify-center relative ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } ${possibleMoves.some(move => move.row === row && move.col === col) ? "bg-green-500" : ""}`}
              onClick={() => handleSquareClick(row, col)}
            >
              {pieceImageSrc && (
                <Image src={pieceImageSrc} alt={piece || ""} fill priority />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}