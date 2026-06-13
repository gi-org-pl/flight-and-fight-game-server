import dataSource from '../../src/core/infra/database/data-source';
import {
  Session,
  SessionState,
} from '../../src/modules/session/infra/database/entity/session.entity';
import { Player } from '../../src/modules/session/infra/database/entity/player.entity';
import { CharacterType } from '../../src/modules/session/model/character/character.model';

const seedCharacters = [
  CharacterType.IRIS,
  CharacterType.SKYE,
  CharacterType.SUNNY,
  CharacterType.THORA,
  CharacterType.VEGA,
];

export const seedSessions = {
  waitingForSecondPlayer: {
    id: '01HRESEED000000000000000S1',
    firstPlayerId: '01HRESEED0000000000000P101',
  },
  ready: {
    id: '01HRESEED000000000000000S2',
    firstPlayerId: '01HRESEED0000000000000P201',
    secondPlayerId: '01HRESEED0000000000000P202',
  },
  waitingForCharacterChoice: {
    id: '01HRESEED000000000000000S3',
    firstPlayerId: '01HRESEED0000000000000P301',
    secondPlayerId: '01HRESEED0000000000000P302',
  },
};

async function seed(): Promise<void> {
  await dataSource.initialize();
  await dataSource.dropDatabase();
  await dataSource.runMigrations();

  const players = dataSource.getRepository(Player);
  await players.save([
    {
      id: seedSessions.waitingForSecondPlayer.firstPlayerId,
    },
    {
      id: seedSessions.ready.firstPlayerId,
      characters: seedCharacters.map((characterType) => ({ characterType })),
    },
    {
      id: seedSessions.ready.secondPlayerId,
      characters: seedCharacters.map((characterType) => ({ characterType })),
    },
    {
      id: seedSessions.waitingForCharacterChoice.firstPlayerId,
    },
    {
      id: seedSessions.waitingForCharacterChoice.secondPlayerId,
    },
  ]);

  const sessions = dataSource.getRepository(Session);
  await sessions.insert([
    {
      id: seedSessions.waitingForSecondPlayer.id,
      state: SessionState.WAITING_FOR_SECOND_PLAYER,
      firstPlayerId: seedSessions.waitingForSecondPlayer.firstPlayerId,
      secondPlayerId: null,
      currentlyAttackingPlayerId: null,
    },
    {
      id: seedSessions.ready.id,
      state: SessionState.READY,
      firstPlayerId: seedSessions.ready.firstPlayerId,
      secondPlayerId: seedSessions.ready.secondPlayerId,
      currentlyAttackingPlayerId: seedSessions.ready.firstPlayerId,
    },
    {
      id: seedSessions.waitingForCharacterChoice.id,
      state: SessionState.WAITING_FOR_CHARACTER_CHOICE,
      firstPlayerId: seedSessions.waitingForCharacterChoice.firstPlayerId,
      secondPlayerId: seedSessions.waitingForCharacterChoice.secondPlayerId,
      currentlyAttackingPlayerId: null,
    },
  ]);

  await dataSource.destroy();
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
