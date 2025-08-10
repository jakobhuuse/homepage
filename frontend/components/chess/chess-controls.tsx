'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GameStateDto } from '@/app/api/generated/model';

interface ChessControlsProps {
  game: GameStateDto;
  onAbandonGame: () => void;
  onNewGame: () => void;
  isAbandoning: boolean;
}

export default function ChessControls({
  game,
  onAbandonGame,
  onNewGame,
  isAbandoning
}: ChessControlsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          {game.status === 'in_progress' && (
            <Button
              variant="destructive"
              onClick={onAbandonGame}
              disabled={isAbandoning}
              className="w-full"
            >
              {isAbandoning ? 'Abandoning...' : 'Abandon Game'}
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={onNewGame}
            className="w-full"
          >
            New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}