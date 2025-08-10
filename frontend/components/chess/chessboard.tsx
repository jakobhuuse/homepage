'use client';

import React from 'react';
import ChessSquare from './chess-square';
import { GameStateDto } from '@/app/api/generated/model';

interface ChessBoardProps {
  game: GameStateDto;
  selectedSquare: string | null;
  validMoves: string[];
  lastMove: { from: string; to: string } | null;
  onSquareClick: (square: string) => void;
}

export default function ChessBoard({
  game,
  selectedSquare,
  validMoves,
  lastMove,
  onSquareClick
}: ChessBoardProps) {
  const renderBoard = () => {
    const squares = [];
    for (let rank = 8; rank >= 1; rank--) {
      for (let file = 0; file < 8; file++) {
        const square = String.fromCharCode(97 + file) + rank; // a1, b1, etc.
        const piece = game.boardState[square] || null;
        const isSelected = selectedSquare === square;
        const isValidMove = validMoves.includes(square);
        const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
        
        squares.push(
          <ChessSquare
            key={square}
            square={square}
            piece={piece}
            isSelected={isSelected}
            isValidMove={isValidMove}
            isLastMove={!!isLastMoveSquare}
            onClick={() => onSquareClick(square)}
          />
        );
      }
    }
    return squares;
  };

  return (
    <div className="flex-1 flex justify-center">
      <div className="aspect-square grid grid-cols-8 w-full max-w-2xl">
        {renderBoard()}
      </div>
    </div>
  );
}