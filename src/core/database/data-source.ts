import 'reflect-metadata';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { entities } from './entities';

const migrationsGlob = __filename.endsWith('.js') ? '*.js' : '*.ts';

export const dataSourceOptions = {
  type: 'postgres' as const,
  url: process.env.DATABASE_URL,
  entities,
  synchronize: false,
};

export default new DataSource({
  ...dataSourceOptions,
  migrations: [join(__dirname, 'migration', migrationsGlob)],
  migrationsTableName: 'migrations',
});
