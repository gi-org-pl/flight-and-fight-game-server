import { ConflictException, NotFoundException } from '@nestjs/common';

export class SessionNotFoundError extends NotFoundException {
  constructor() {
    super('Session with given id does not exist.');
  }
}

export class SessionByJoinCodeNotFoundError extends NotFoundException {
  constructor() {
    super('Session with given join code does not exist.');
  }
}

export class SessionNotOpenError extends ConflictException {
  constructor() {
    super('Session is not open for joining.');
  }
}
