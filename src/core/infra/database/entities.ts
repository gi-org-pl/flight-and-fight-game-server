import { Session } from '../../../modules/session/infra/database/entity/session.entity';
import { Player } from '../../../modules/session/infra/database/entity/player.entity';
import { PlayerCharacter } from '../../../modules/session/infra/database/entity/player-character.entity';

export const entities = [Session, Player, PlayerCharacter];
