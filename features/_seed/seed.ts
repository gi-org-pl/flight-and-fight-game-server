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
  open: {
    id: '01HRESEED000000000000000S1',
    firstPlayerId: '01HRESEED0000000000000P101',
  },
  closed: {
    id: '01HRESEED000000000000000S2',
    firstPlayerId: '01HRESEED0000000000000P201',
    secondPlayerId: '01HRESEED0000000000000P202',
  },
};

async function seed(): Promise<void> {
  await dataSource.initialize();
  await dataSource.dropDatabase();
  await dataSource.runMigrations();

  const players = dataSource.getRepository(Player);
  await players.save(
    [
      seedSessions.open.firstPlayerId,
      seedSessions.closed.firstPlayerId,
      seedSessions.closed.secondPlayerId,
    ].map((id) => ({
      id,
      characters: seedCharacters.map((characterType) => ({ characterType })),
    })),
  );

  const sessions = dataSource.getRepository(Session);
  await sessions.insert([
    {
      id: seedSessions.open.id,
      state: SessionState.OPEN,
      firstPlayerId: seedSessions.open.firstPlayerId,
      secondPlayerId: null,
    },
    {
      id: seedSessions.closed.id,
      state: SessionState.CLOSED,
      firstPlayerId: seedSessions.closed.firstPlayerId,
      secondPlayerId: seedSessions.closed.secondPlayerId,
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
