import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SessionState {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity('session')
export class Session {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'enum', enum: SessionState, default: SessionState.OPEN })
  state: SessionState;

  @Column('varchar')
  firstPlayerId: string;

  @Column({ type: 'varchar', nullable: true })
  secondPlayerId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
