'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, Copy } from 'lucide-react';
import { GameStateDto } from '@/app/api/generated/model';

interface ChessGameStatusProps {
  game: GameStateDto;
  playerId: string;
  onCopyInviteCode: () => void;
}

export default function ChessGameStatus({
  game,
  playerId,
  onCopyInviteCode
}: ChessGameStatusProps) {
  const isWhitePlayer = playerId === game.whitePlayerId;
  const isPlayerTurn = (isWhitePlayer && game.currentTurn === 'white') || 
                      (!isWhitePlayer && game.currentTurn === 'black');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Game Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="capitalize">{game.status.replace('_', ' ')}</span>
        </div>
        
        {game.status === 'waiting' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 font-medium">Waiting for opponent</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={game.inviteCode}
                readOnly
                className="text-sm"
              />
              <Button size="sm" onClick={onCopyInviteCode}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {game.status === 'in_progress' && (
          <div className={`p-3 border rounded ${
            isPlayerTurn ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                game.currentTurn === 'white' ? 'bg-gray-300' : 'bg-gray-800'
              }`} />
              <span className="font-medium">
                {game.currentTurn === 'white' ? 'White' : 'Black'} to move
              </span>
            </div>
            {isPlayerTurn && (
              <p className="text-sm text-green-700 mt-1">Your turn!</p>
            )}
          </div>
        )}

        {game.status === 'completed' && game.winner && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <span className="font-medium">
              {game.winner.charAt(0).toUpperCase() + game.winner.slice(1)} wins!
            </span>
            {game.isCheckmate && <p className="text-sm">Checkmate</p>}
            {game.isStalemate && <p className="text-sm">Stalemate</p>}
          </div>
        )}

        {game.isCheck && !game.isCheckmate && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-red-800 font-medium">
            Check!
          </div>
        )}
      </CardContent>
    </Card>
  );
}