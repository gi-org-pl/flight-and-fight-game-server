import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CharacterType } from '../../../model/character/character.model';
import { Superpower } from '../../../model/character/superpowers.model';
import { Player } from './player.entity';

@Entity('player_character')
export class PlayerCharacter {
  @PrimaryColumn('varchar')
  playerId: string;

  @PrimaryColumn({ type: 'enum', enum: CharacterType })
  characterType: CharacterType;

  @Column({ type: 'enum', enum: Superpower })
  superpower: Superpower;

  @Column('int')
  intelligence: number;

  @Column('int')
  defense: number;

  @Column('int')
  power: number;

  @Column('numeric', {
    precision: 5,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  health: number;

  @ManyToOne(() => Player, (player) => player.characters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playerId' })
  player: Player;
}
