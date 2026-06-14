import { ValidationError, ValidationPipe } from '@nestjs/common';
import { formatValidationErrors } from '../../http/validation/exception.factory';
import { WsValidationException } from './ws-validation.exception';

export function createWsValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors: ValidationError[]) =>
      new WsValidationException(formatValidationErrors(errors)),
  });
}
