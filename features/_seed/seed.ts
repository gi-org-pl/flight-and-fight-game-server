import dataSource from '../../src/core/infra/database/data-source';
import {
  Session,
  SessionState,
} from '../../src/modules/session/infra/database/entity/session.entity';
import { Player } from '../../src/modules/session/infra/database/entity/player.entity';
import { CharacterType } from '../../src/modules/session/model/character/character.model';
import { getCharacter } from '../../src/modules/session/model/character/character.catalog';

const seedCharacters = [
  CharacterType.IRIS,
  CharacterType.SKYE,
  CharacterType.SUNNY,
  CharacterType.THORA,
  CharacterType.VEGA,
];

const seedCharacterRows = seedCharacters.map((type) => {
  const character = getCharacter(type);

  return {
    characterType: character.type,
    superpower: character.superpower,
    intelligence: character.stats.intelligence,
    defense: character.stats.defense,
    power: character.stats.power,
    health: character.stats.health,
  };
});

const nearlyDefeatedRows = seedCharacterRows.map((row) =>
  row.characterType === CharacterType.VEGA
    ? { ...row, health: 2, isDead: false }
    : { ...row, health: 0, isDead: true },
);

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
  onePlayerNearlyDefeated: {
    id: '01HRESEED000000000000000S4',
    firstPlayerId: '01HRESEED0000000000000P401',
    secondPlayerId: '01HRESEED0000000000000P402',
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
      characters: seedCharacterRows.map((row) => ({ ...row })),
    },
    {
      id: seedSessions.ready.secondPlayerId,
      characters: seedCharacterRows.map((row) => ({ ...row })),
    },
    {
      id: seedSessions.waitingForCharacterChoice.firstPlayerId,
    },
    {
      id: seedSessions.waitingForCharacterChoice.secondPlayerId,
    },
    {
      id: seedSessions.onePlayerNearlyDefeated.firstPlayerId,
      characters: seedCharacterRows.map((row) => ({ ...row })),
    },
    {
      id: seedSessions.onePlayerNearlyDefeated.secondPlayerId,
      characters: nearlyDefeatedRows.map((row) => ({ ...row })),
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
    {
      id: seedSessions.onePlayerNearlyDefeated.id,
      state: SessionState.READY,
      firstPlayerId: seedSessions.onePlayerNearlyDefeated.firstPlayerId,
      secondPlayerId: seedSessions.onePlayerNearlyDefeated.secondPlayerId,
      currentlyAttackingPlayerId:
        seedSessions.onePlayerNearlyDefeated.firstPlayerId,
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
