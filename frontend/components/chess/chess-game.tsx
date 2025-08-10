'use client';

import React, { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  usePostChessCreate, 
  usePostChessJoin, 
  useGetChessGameId,
  usePostChessGameIdMove,
  usePostChessGameIdAbandon 
} from '@/app/api/generated/chess/chess';
import { AlertCircle } from 'lucide-react';
import ChessSetup from '@/components/chess/chess-setup';
import ChessBoard from '@/components/chess/chessboard';
import ChessSidebar from '@/components/chess/chess-sidebar';

export default function ChessGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameIdParam = searchParams.get('gameId');
  
  const [gameId, setGameId] = useState<string>(gameIdParam || '');
  const [playerId, setPlayerId] = useState<string>('');
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [error, setError] = useState<string>('');

  // API hooks
  const createGameMutation = usePostChessCreate();
  const joinGameMutation = usePostChessJoin();
  const moveMutation = usePostChessGameIdMove();
  const abandonMutation = usePostChessGameIdAbandon();
  
  const { data: gameData, refetch: refetchGame, isLoading: isLoadingGame } = useGetChessGameId(
    gameId,
    {
      query: {
        enabled: !!gameId,
        refetchInterval: gameId ? 2000 : false, // Poll every 2 seconds when in game
      }
    }
  );

  const game = gameData?.data;

  // Handle game creation
  const handleCreateGame = useCallback(async (playerName: string) => {
    try {
      setError('');
      const response = await createGameMutation.mutateAsync();
      const newGame = response.data;
      setGameId(newGame.id);
      setPlayerId(newGame.whitePlayerId || '');
      
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set('gameId', newGame.id);
      router.replace(url.pathname + url.search);
    } catch (error) {
      console.error('Failed to create game:', error);
      setError('Failed to create game. Please try again.');
    }
  }, [createGameMutation, router]);

  // Handle joining game
  const handleJoinGame = useCallback(async (inviteCode: string, playerName: string) => {
    try {
      setError('');
      const response = await joinGameMutation.mutateAsync({
        data: { inviteCode }
      });
      const joinedGame = response.data;
      setGameId(joinedGame.id);
      setPlayerId(joinedGame.blackPlayerId || '');
      
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set('gameId', joinedGame.id);
      router.replace(url.pathname + url.search);
    } catch (error) {
      console.error('Failed to join game:', error);
      setError('Failed to join game. Please check the invite code.');
    }
  }, [joinGameMutation, router]);

  // Copy invite code to clipboard
  const copyInviteCode = useCallback(async () => {
    if (game?.inviteCode) {
      try {
        await navigator.clipboard.writeText(game.inviteCode);
        // Could add a toast notification here
      } catch (error) {
        console.error('Failed to copy invite code:', error);
      }
    }
  }, [game?.inviteCode]);

  // Handle square click
  const handleSquareClick = useCallback(async (square: string) => {
    if (!game || !playerId) return;
    
    // Determine if it's the current player's turn
    const isWhitePlayer = playerId === game.whitePlayerId;
    const isPlayerTurn = (isWhitePlayer && game.currentTurn === 'white') || 
                        (!isWhitePlayer && game.currentTurn === 'black');
    
    if (!isPlayerTurn || game.status !== 'in_progress') return;

    if (!selectedSquare) {
      // Select a square if it has a piece of the current player's color
      const piece = game.boardState[square];
      if (piece && piece.color === game.currentTurn) {
        setSelectedSquare(square);
        // In a real implementation, you'd calculate valid moves here
        // For now, we'll clear valid moves
        setValidMoves([]);
      }
    } else {
      if (selectedSquare === square) {
        // Deselect
        setSelectedSquare(null);
        setValidMoves([]);
      } else {
        // Try to make a move
        try {
          setError('');
          await moveMutation.mutateAsync({
            gameId: game.id,
            data: {
              playerId,
              from: selectedSquare,
              to: square
            }
          });
          
          setSelectedSquare(null);
          setValidMoves([]);
          setLastMove({ from: selectedSquare, to: square });
          
          // Refetch game state
          await refetchGame();
        } catch (error) {
          console.error('Invalid move:', error);
          setError('Invalid move. Please try again.');
        }
      }
    }
  }, [game, playerId, selectedSquare, moveMutation, refetchGame]);

  // Handle game abandonment
  const handleAbandonGame = useCallback(async () => {
    if (!game || !playerId) return;
    
    try {
      await abandonMutation.mutateAsync({
        gameId: game.id,
        data: { playerId }
      });
      await refetchGame();
    } catch (error) {
      console.error('Failed to abandon game:', error);
      setError('Failed to abandon game.');
    }
  }, [game, playerId, abandonMutation, refetchGame]);

  // Handle new game
  const handleNewGame = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('gameId');
    router.replace(url.pathname + url.search);
    setGameId('');
    setPlayerId('');
    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove(null);
    setError('');
  }, [router]);

  // Show game setup if no game is active
  if (!gameId || !game) {
    return (
      <div className="container mx-auto p-4">
        <ChessSetup
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
          isCreating={createGameMutation.isPending}
          isJoining={joinGameMutation.isPending}
          error={error}
        />
      </div>
    );
  }

  if (isLoadingGame) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">Loading game...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <ChessBoard
          game={game}
          selectedSquare={selectedSquare}
          validMoves={validMoves}
          lastMove={lastMove}
          onSquareClick={handleSquareClick}
        />

        <ChessSidebar
          game={game}
          playerId={playerId}
          onCopyInviteCode={copyInviteCode}
          onAbandonGame={handleAbandonGame}
          onNewGame={handleNewGame}
          isAbandoning={abandonMutation.isPending}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
    </div>
  );
}