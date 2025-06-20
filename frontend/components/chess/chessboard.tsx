"use client";

import { useState } from "react";
import Image from "next/image";
import { ChessPiece, pieceData } from "./types";
import { initialBoard, getPossibleMoves } from "./game-logic";

export default function Chessboard() {
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<
    { row: number; col: number }[]
  >([]);

  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare) {
      const newBoard = board.map((r) => r.slice());
      const piece = newBoard[selectedSquare.row][selectedSquare.col];
      if (
        piece &&
        possibleMoves.some((move) => move.row === row && move.col === col)
      ) {
        newBoard[row][col] = piece;
        newBoard[selectedSquare.row][selectedSquare.col] = null;
        setBoard(newBoard);
        console.log(
          `Moved piece from (${selectedSquare.row}, ${selectedSquare.col}) to (${row}, ${col})`
        );
      }
      setSelectedSquare(null);
      setPossibleMoves([]);
    } else {
      const piece = board[row][col];
      if (piece) {
        setSelectedSquare({ row, col });
        setPossibleMoves(getPossibleMoves(board, row, col));
      }
    }
  };

  const rows = Array.from({ length: board.length }, (_, i) => i);
  const cols = Array.from({ length: board[0].length }, (_, i) => i);

  return (
    <div className="aspect-square grid grid-cols-8 w-full">
      {rows.flatMap((row) =>
        cols.map((col) => {
          const isDark = (row + col) % 2 === 1;
          const piece = board[row][col];
          const isSelected =
            selectedSquare &&
            selectedSquare.row === row &&
            selectedSquare.col === col;

          const isPossibleMove = possibleMoves.some(
            (move) => move.row === row && move.col === col
          );

          return (
            <div
              key={`${row}-${col}`}
              className={`w-full h-full flex items-center justify-center relative 
                ${isDark ? "bg-gray-700" : "bg-gray-200"}
                ${isSelected ? "ring-4 ring-yellow-400 z-10" : ""}
                ${
                  isPossibleMove
                    ? "after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-6 after:h-6 after:bg-black/40 after:rounded-full"
                    : ""
                }
                `}
              onClick={() => handleSquareClick(row, col)}
            >
              {piece && <Image src={piece.src} alt={piece.alt} fill priority />}
            </div>
          );
        })
      )}
    </div>
  );
}
