'use client'

import { usePostChessCreate } from "@/app/api/generated/chess/chess";
import { Button } from "../ui/button";


export default function ChessBoard() {
const createGameMutation = usePostChessCreate();

const handleCreateGame = () => {
  createGameMutation.mutate();
};

// Check the results
const { data, isError, isPending, isSuccess } = createGameMutation;

    return (
        <div>
           { !isSuccess && <Button onClick={handleCreateGame}>
            Create Game
            </Button>
            }
            {isPending && <p>Creating game...</p>}
            {isError && <p>Error creating game.</p>}
            {data && <p>Game created! Invite code: {data.data.inviteCode}</p>}
        </div>
        
    );
}   
