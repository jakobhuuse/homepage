'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChessMove, ChessPiece } from '@/app/api/generated/model';
import { getPieceImagePath } from './utils';



interface ChessMoveHistoryProps {
  moveHistory: ChessMove[];
}

export default function ChessMoveHistory({ moveHistory }: ChessMoveHistoryProps) {
  if (moveHistory.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Move History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-40 overflow-y-auto space-y-1 text-sm">
          {moveHistory.map((move, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{move.moveNumber}.</span>
              <span className="font-mono">{move.from}-{move.to}</span>
              <div className="w-5 h-5 flex items-center justify-center">
                <Image
                  src={getPieceImagePath(move.piece)}
                  alt={`${move.piece.color} ${move.piece.type}`}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}