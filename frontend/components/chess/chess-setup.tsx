'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Users, Gamepad2, Copy, Check } from 'lucide-react';

interface ChessSetupProps {
  onCreateGame: () => void;
  onJoinGame: (inviteCode: string) => void;
  isCreating: boolean;
  isJoining: boolean;
  error?: string;
}

export default function ChessSetup({ 
  onCreateGame, 
  onJoinGame, 
  isCreating, 
  isJoining,
  error 
}: ChessSetupProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [copied, setCopied] = useState(false);

  const handleCreateGame = () => {
    onCreateGame();
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    onJoinGame(inviteCode.trim());
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isLoading = isCreating || isJoining;

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Gamepad2 className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl">Chess Game</CardTitle>
          <p className="text-sm text-muted-foreground">
            Create a new game or join an existing one
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={mode === 'create' ? 'default' : 'outline'}
              onClick={() => setMode('create')}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Users className="h-4 w-4" />
              Create Game
            </Button>
            <Button
              type="button"
              variant={mode === 'join' ? 'default' : 'outline'}
              onClick={() => setMode('join')}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Gamepad2 className="h-4 w-4" />
              Join Game
            </Button>
          </div>

          {/* Create Game Section */}
          {mode === 'create' && (
            <div className="space-y-4">
              <Button
                onClick={handleCreateGame}
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating Game...
                  </div>
                ) : (
                  'Create New Game'
                )}
              </Button>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Creating a New Game
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    You'll play as White pieces and get an invite code to share with your opponent.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Join Game Section */}
          {mode === 'join' && (
            <div className="space-y-4">
              <form onSubmit={handleJoinGame} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="inviteCode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Invite Code
                  </label>
                  <Input
                    id="inviteCode"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="Enter invite code"
                    required
                    disabled={isLoading}
                    className="w-full font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ask your friend for the game invite code
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!inviteCode.trim() || isLoading}
                  size="lg"
                >
                  {isJoining ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Joining Game...
                    </div>
                  ) : (
                    'Join Game'
                  )}
                </Button>
              </form>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" />
                    Joining an Existing Game
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    You'll play as Black pieces. Make sure you have the correct invite code from your friend.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}