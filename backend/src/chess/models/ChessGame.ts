import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { GameStatus, PieceColor } from '../types'

@Entity('chess_games')
export class ChessGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  whitePlayerId: string;

  @Column({ nullable: true })
  blackPlayerId: string;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.WAITING
  })
  status: GameStatus;

  @Column({
    type: 'enum',
    enum: PieceColor,
    default: PieceColor.WHITE
  })
  currentTurn: PieceColor;

  @Column('text')
  boardState: string; // JSON string of board state

  @Column('text', { default: '[]' })
  moveHistory: string; // JSON string of move history

  @Column({ nullable: true })
  winner: PieceColor;

  @Column({ default: false })
  isCheck: boolean;

  @Column({ default: false })
  isCheckmate: boolean;

  @Column({ default: false })
  isStalemate: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}