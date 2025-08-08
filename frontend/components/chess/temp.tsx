'use client'

import { usePostChessCreate } from "@/app/api/generated/chess/chess";


export default function ChessBoard() {
    const {data, isError} = usePostChessCreate()

    console.log(data, isError);

    return (
        <div>Hello!</div>
    )
}