import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SessionState {
  WAITING_FOR_SECOND_PLAYER = 'WAITING_FOR_SECOND_PLAYER',
  WAITING_FOR_CHARACTER_CHOICE = 'WAITING_FOR_CHARACTER_CHOICE',
  READY = 'READY',
  FINISHED = 'FINISHED',
}

@Entity('session')
export class Session {
  @PrimaryColumn('varchar')
  id: string;

  @Column({
    type: 'enum',
    enum: SessionState,
    default: SessionState.WAITING_FOR_SECOND_PLAYER,
  })
  state: SessionState;

  @Column('varchar')
  firstPlayerId: string;

  @Column({ type: 'varchar', nullable: true })
  secondPlayerId: string | null;

  @Column({ type: 'varchar', nullable: true })
  currentlyAttackingPlayerId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
