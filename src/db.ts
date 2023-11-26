import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

export const configService = new ConfigService();

config();

export const getDbConfig = (cs: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  host: cs.getOrThrow('DB_HOST'),
  port: cs.get('DB_PORT', 5432),
  username: cs.getOrThrow('DB_USER'),
  password: cs.getOrThrow('DB_PASS'),
  database: cs.getOrThrow('DB_NAME'),
  migrations: [join(__dirname, '**/migrations', '*.ts')],
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
});

export default new DataSource(getDbConfig(configService));
