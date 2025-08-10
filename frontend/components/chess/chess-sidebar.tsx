'use client';

import React from 'react';
import ChessGameStatus from './chess-status';
import ChessMoveHistory from './chess-move-history';
import ChessControls from './chess-controls';
import { GameStateDto } from '@/app/api/generated/model';

interface ChessGameSidebarProps {
  game: GameStateDto;
  playerId: string;
  onCopyInviteCode: () => void;
  onAbandonGame: () => void;
  onNewGame: () => void;
  isAbandoning: boolean;
}

export default function ChessGameSidebar({
  game,
  playerId,
  onCopyInviteCode,
  onAbandonGame,
  onNewGame,
  isAbandoning
}: ChessGameSidebarProps) {
  return (
    <div className="w-full lg:w-80 space-y-4">
      <ChessGameStatus
        game={game}
        playerId={playerId}
        onCopyInviteCode={onCopyInviteCode}
      />
      
      <ChessControls
        game={game}
        onAbandonGame={onAbandonGame}
        onNewGame={onNewGame}
        isAbandoning={isAbandoning}
      />
      
      <ChessMoveHistory
        moveHistory={game.moveHistory}
      />
    </div>
  );
}