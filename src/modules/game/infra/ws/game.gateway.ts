import { Logger } from '@nestjs/common';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { isValid as isValidUlid } from 'ulidx';
import { GetSessionQuery } from '../../../session/application/query/get-session.query';
import { GetMyCharactersQuery } from '../../../session/application/query/get-my-characters.query';
import { Session } from '../../../session/infra/database/entity/session.entity';
import { Character } from '../../../session/model/character/character.model';
import { AttackDefendedEvent } from '../../model/event/attack-defended.event';
import {
  AttackAlreadyPendingError,
  NoAttackToDefendError,
  NotDefendingPlayerError,
  NotYourTurnError,
} from '../../model/error/game.error';

interface GameSocket extends Socket {
  data: { playerId: string; sessionId: string };
}

@WebSocketGateway({ namespace: 'game', cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;

  private readonly logger = new Logger(GameGateway.name);

  private readonly pendingAttacks = new Set<string>();

  constructor(
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  afterInit(server: Server): void {
    server.use((socket, next) => {
      this.authenticate(socket as GameSocket)
        .then(() => next())
        .catch((error: Error) => next(error));
    });
  }

  async handleConnection(@ConnectedSocket() client: GameSocket): Promise<void> {
    await client.join(client.data.sessionId);
    await client.join(client.data.playerId);
    client.emit('session', await this.getSession(client.data.sessionId));
  }

  @SubscribeMessage('attack')
  async onAttack(@ConnectedSocket() client: GameSocket): Promise<void> {
    const { playerId, sessionId } = client.data;
    const session = await this.getSession(sessionId);

    if (session.currentlyAttackingPlayerId !== playerId) {
      throw new NotYourTurnError();
    }
    if (this.pendingAttacks.has(sessionId)) {
      throw new AttackAlreadyPendingError();
    }

    this.pendingAttacks.add(sessionId);
    this.server.to(sessionId).emit('attacked', { attackingPlayerId: playerId });
    this.logger.log(`Player ${playerId} attacked in session ${sessionId}`);

    const defenderId = this.opponentOf(session, playerId);
    const characters = await this.queryBus.execute<
      GetMyCharactersQuery,
      Character[]
    >(new GetMyCharactersQuery(defenderId));
    this.server.to(defenderId).emit('charactersUpdated', characters);
  }

  @SubscribeMessage('defend')
  async onDefend(@ConnectedSocket() client: GameSocket): Promise<void> {
    const { playerId, sessionId } = client.data;
    const session = await this.getSession(sessionId);

    if (session.currentlyAttackingPlayerId === playerId) {
      throw new NotDefendingPlayerError();
    }
    if (!this.pendingAttacks.has(sessionId)) {
      throw new NoAttackToDefendError();
    }

    this.pendingAttacks.delete(sessionId);
    this.logger.log(`Player ${playerId} defended in session ${sessionId}`);
    this.eventBus.publish(new AttackDefendedEvent(sessionId));
  }

  async broadcastTurnChanged(sessionId: string): Promise<void> {
    this.server
      .to(sessionId)
      .emit('turnChanged', await this.getSession(sessionId));
  }

  private opponentOf(session: Session, playerId: string): string {
    return session.firstPlayerId === playerId
      ? (session.secondPlayerId as string)
      : session.firstPlayerId;
  }

  private getSession(sessionId: string): Promise<Session> {
    return this.queryBus.execute<GetSessionQuery, Session>(
      new GetSessionQuery(sessionId),
    );
  }

  private async authenticate(socket: GameSocket): Promise<void> {
    const token = socket.handshake.auth?.token as string | undefined;
    const sessionId = socket.handshake.auth?.sessionId as string | undefined;

    if (!token || !isValidUlid(token) || !sessionId) {
      throw new Error('Unauthorized');
    }

    let session: Session;
    try {
      session = await this.getSession(sessionId);
    } catch {
      throw new Error('Unauthorized');
    }

    if (session.firstPlayerId !== token && session.secondPlayerId !== token) {
      throw new Error('Unauthorized');
    }

    socket.data = { playerId: token, sessionId };
  }
}
