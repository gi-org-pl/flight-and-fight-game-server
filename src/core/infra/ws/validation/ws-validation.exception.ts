import { WsException } from '@nestjs/websockets';

export class WsValidationException extends WsException {
  constructor(violations: Record<string, string[]>) {
    super({
      status: 'error',
      message: 'Message validation failed.',
      violations,
    });
  }
}
