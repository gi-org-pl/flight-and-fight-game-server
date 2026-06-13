import { After, Given, Then, When } from '@cucumber/cucumber';
import expect from 'expect';
import { io, Socket } from 'socket.io-client';
import { deepCompare } from '../_helper/deep-compare';

const wsUrl = 'http://localhost:3000/game';
const sockets = new Map<string, Socket>();
const received = new Map<string, Array<{ event: string; payload: unknown }>>();
const connectErrors = new Map<string, string>();

function connect(playerId: string, sessionId: string): Promise<void> {
  const socket = io(wsUrl, {
    auth: { token: playerId, sessionId },
    transports: ['websocket'],
    forceNew: true,
  });
  sockets.set(playerId, socket);
  received.set(playerId, []);

  socket.onAny((event: string, payload: unknown) => {
    received.get(playerId)?.push({ event, payload });
  });
  socket.on('connect_error', (error: Error) => {
    connectErrors.set(playerId, error.message);
  });

  return new Promise((resolve) => {
    socket.on('session', () => resolve());
    socket.on('connect_error', () => resolve());
    setTimeout(resolve, 2000);
  });
}

async function waitForEvent(
  playerId: string,
  event: string,
): Promise<{ event: string; payload: unknown } | undefined> {
  const deadline = Date.now() + 2000;
  while (Date.now() < deadline) {
    const found = received.get(playerId)?.find((e) => e.event === event);
    if (found) {
      return found;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return undefined;
}

Given(
  'player {string} connects to the session channel for {string}',
  async (playerId: string, sessionId: string) => {
    await connect(playerId, sessionId);
  },
);

When('player {string} emits {string}', (playerId: string, event: string) => {
  sockets.get(playerId)?.emit(event);
});

Then(
  'player {string} receives {string}',
  async (playerId: string, event: string) => {
    const found = await waitForEvent(playerId, event);
    expect(found).toBeDefined();
  },
);

Then(
  'player {string} receives {string} with:',
  async (playerId: string, event: string, docString: string) => {
    const found = await waitForEvent(playerId, event);
    expect(found).toBeDefined();
    deepCompare(found?.payload, JSON.parse(docString));
  },
);

Then('player {string} connection is rejected', (playerId: string) => {
  expect(connectErrors.get(playerId)).toBe('Unauthorized');
});

After(() => {
  for (const socket of sockets.values()) {
    socket.disconnect();
  }
  sockets.clear();
  received.clear();
  connectErrors.clear();
});
