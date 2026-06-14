export class GameFinishedEvent {
  constructor(
    public readonly sessionId: string,
    public readonly winnerId: string,
    public readonly loserId: string,
  ) {}
}
