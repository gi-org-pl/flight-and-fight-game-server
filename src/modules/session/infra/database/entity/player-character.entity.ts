import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CharacterType } from '../../../model/character/character.model';
import { Player } from './player.entity';

@Entity('player_character')
export class PlayerCharacter {
  @PrimaryColumn('varchar')
  playerId: string;

  @PrimaryColumn({ type: 'enum', enum: CharacterType })
  characterType: CharacterType;

  @ManyToOne(() => Player, (player) => player.characters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playerId' })
  player: Player;
}
