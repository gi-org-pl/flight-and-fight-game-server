import { INestApplication } from '@nestjs/common';
import { isProduction } from '../../consts';

export function configureCors(app: INestApplication): void {
  app.enableCors({
    origin: isProduction
      ? 'https://api-faf.gi.org.pl/'
      : 'http://localhost:5173',
    credentials: true, // allow cookies / Authorization headers
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
}
