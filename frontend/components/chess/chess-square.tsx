'use client';

import React from 'react';
import Image from 'next/image';
import { ChessPiece } from '@/app/api/generated/model';

const getPieceImagePath = (piece: ChessPiece): string => {
  const color = piece.color === 'white' ? 'w' : 'b';
  return `/games/chess/pieces/${piece.type}-${color}.svg`;
};

interface ChessSquareProps {
  square: string;
  piece: ChessPiece | null;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMove: boolean;
  onClick: () => void;
}

export default function ChessSquare({ 
  square, 
  piece, 
  isSelected, 
  isValidMove, 
  isLastMove, 
  onClick 
}: ChessSquareProps) {
  const file = square.charCodeAt(0) - 97; // a=0, b=1, etc.
  const rank = parseInt(square[1]) - 1; // 1=0, 2=1, etc.
  const isDark = (file + rank) % 2 === 1;
  
  let squareClass = `w-full h-full flex items-center justify-center relative cursor-pointer
    ${isDark ? "bg-gray-700" : "bg-gray-200"}
    ${isSelected ? "ring-4 ring-yellow-400 z-10" : ""}
    ${
      isValidMove
        ? "after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-6 after:h-6 after:bg-black/40 after:rounded-full"
        : ""
    }
    ${isLastMove ? "ring-2 ring-blue-400" : ""}
  `;

  return (
    <div className={squareClass} onClick={onClick}>
      {piece && (
        <Image
          src={getPieceImagePath(piece)}
          alt={`${piece.color} ${piece.type}`}
          fill
          className="object-contain select-none pointer-events-none"
          priority
        />
      )}
    </div>
  );
}