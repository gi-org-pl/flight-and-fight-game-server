import { INestApplication } from '@nestjs/common';

export function configureCors(app: INestApplication): void {
  app.enableCors({
    origin: ['https://api-faf.gi.org.pl/', 'http://localhost:5173'],
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
}
