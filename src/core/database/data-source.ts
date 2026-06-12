import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { entities } from './entities';

export const dataSourceOptions = {
  type: 'postgres' as const,
  url: process.env.DATABASE_URL,
  entities,
  synchronize: false,
};

export default new DataSource({
  ...dataSourceOptions,
  migrations: ['src/core/database/migration/*.ts'],
  migrationsTableName: 'migrations',
});
