import dataSource from '../../src/core/database/data-source';
import {
  Session,
  SessionState,
} from '../../src/modules/session/infra/database/session.entity';

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
