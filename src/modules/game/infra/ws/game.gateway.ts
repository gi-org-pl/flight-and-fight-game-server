import { Logger } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  ConnectedSocket,
  MessageBody,
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
import {
  Session,
  SessionState,
} from '../../../session/infra/database/entity/session.entity';
import {
  CharacterType,
  OwnedCharacter,
} from '../../../session/model/character/character.model';
import { AttackDefendedEvent } from '../../model/event/attack-defended.event';
import { CharactersSelectedEvent } from '../../model/event/characters-selected.event';
import { GameFinishedEvent } from '../../model/event/game-finished.event';
import {
  AttackAlreadyPendingError,
  CharactersLockedError,
  GameAlreadyFinishedError,
  NoAttackToDefendError,
  NotDefendingPlayerError,
  NotYourTurnError,
} from '../../model/error/game.error';
import { createWsValidationPipe } from '../../../../core/infra/ws/validation/ws-validation.pipe';
import { ApplyDamageCommand } from '../../application/command/apply-damage.command';
import {
  calculateDamage,
  PendingAttack,
  resolveAttack,
} from '../../model/attack/attack-damage';
import { AttackMessage } from './dto/attack.message';
import { DefendMessage } from './dto/defend.message';
import { SelectCharactersMessage } from './dto/select-characters.message';

const messageValidation = createWsValidationPipe();

interface GameSocket extends Socket {
  data: { playerId: string; sessionId: string };
}

@WebSocketGateway({ namespace: 'game', cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(GameGateway.name);
  private readonly pendingAttacks = new Map<string, PendingAttack>();

  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
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
  async onAttack(
    @ConnectedSocket() client: GameSocket,
    @MessageBody(messageValidation) body: AttackMessage,
  ): Promise<void> {
    const { playerId, sessionId } = client.data;
    const session = await this.getSession(sessionId);

    if (session.state === SessionState.FINISHED) {
      throw new GameAlreadyFinishedError();
    }
    if (session.currentlyAttackingPlayerId !== playerId) {
      throw new NotYourTurnError();
    }
    if (this.pendingAttacks.has(sessionId)) {
      throw new AttackAlreadyPendingError();
    }

    this.pendingAttacks.set(sessionId, {
      attackerId: playerId,
      attackingCharacter: body.attackingCharacter,
      attackedCharacter: body.attackedCharacter,
      attackDamage: calculateDamage(
        body.attackingCharacter,
        body.attackedCharacter,
        body.quickTimeEventMultiplier,
      ),
    });
    this.server.to(sessionId).emit('attacked', { attackingPlayerId: playerId });
    this.logger.log(`Player ${playerId} attacked in session ${sessionId}`);

    const defenderId = this.opponentOf(session, playerId);
    const characters = await this.queryBus.execute<
      GetMyCharactersQuery,
      OwnedCharacter[]
    >(new GetMyCharactersQuery(defenderId));
    this.server.to(defenderId).emit('charactersUpdated', characters);
  }

  @SubscribeMessage('defend')
  async onDefend(
    @ConnectedSocket() client: GameSocket,
    @MessageBody(messageValidation) body: DefendMessage,
  ): Promise<void> {
    const { playerId, sessionId } = client.data;
    const session = await this.getSession(sessionId);

    if (session.state === SessionState.FINISHED) {
      throw new GameAlreadyFinishedError();
    }
    if (session.currentlyAttackingPlayerId === playerId) {
      throw new NotDefendingPlayerError();
    }
    const pending = this.pendingAttacks.get(sessionId);
    if (!pending) {
      throw new NoAttackToDefendError();
    }

    this.pendingAttacks.delete(sessionId);
    this.logger.log(`Player ${playerId} defended in session ${sessionId}`);

    const resolution = resolveAttack(
      pending,
      playerId,
      body.quickTimeEventMultiplier,
    );
    if (resolution) {
      await this.commandBus.execute(
        new ApplyDamageCommand(
          sessionId,
          resolution.targetPlayerId,
          resolution.targetCharacter,
          resolution.damage,
        ),
      );

      const survivors = await this.queryBus.execute<
        GetMyCharactersQuery,
        OwnedCharacter[]
      >(new GetMyCharactersQuery(resolution.targetPlayerId));
      if (survivors.every((character) => character.isDead)) {
        this.eventBus.publish(
          new GameFinishedEvent(
            sessionId,
            this.opponentOf(session, resolution.targetPlayerId),
            resolution.targetPlayerId,
          ),
        );
        return;
      }
    }

    this.eventBus.publish(new AttackDefendedEvent(sessionId));
  }

  @SubscribeMessage('selectCharacters')
  async onSelectCharacters(
    @ConnectedSocket() client: GameSocket,
    @MessageBody(messageValidation) body: SelectCharactersMessage,
  ): Promise<void> {
    const { playerId, sessionId } = client.data;
    const session = await this.getSession(sessionId);

    if (session.state === SessionState.READY) {
      throw new CharactersLockedError();
    }

    this.logger.log(
      `Player ${playerId} selected characters in session ${sessionId}`,
    );
    this.eventBus.publish(
      new CharactersSelectedEvent(sessionId, playerId, body.characters),
    );
  }

  async broadcastTurnChanged(sessionId: string): Promise<void> {
    this.server
      .to(sessionId)
      .emit('turnChanged', await this.getSession(sessionId));
  }

  async broadcastReady(sessionId: string): Promise<void> {
    this.server.to(sessionId).emit('ready', await this.getSession(sessionId));
  }

  broadcastCharacterDied(
    sessionId: string,
    playerId: string,
    character: CharacterType,
  ): void {
    this.server.to(sessionId).emit('characterDied', { playerId, character });
  }

  broadcastGameFinished(
    sessionId: string,
    winnerId: string,
    loserId: string,
  ): void {
    this.server.to(sessionId).emit('gameFinished', { winnerId, loserId });
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
