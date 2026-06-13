import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlayerCharacter } from './player-character.entity';

@Entity('player')
export class Player {
  @PrimaryColumn('varchar')
  id: string;

  @OneToMany(() => PlayerCharacter, (character) => character.player, {
    cascade: true,
  })
  characters: PlayerCharacter[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
