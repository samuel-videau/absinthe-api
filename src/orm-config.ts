import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
config();

export const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE || 'postgres',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: true,
  ssl: process.env.NODE_ENV === 'production',
};

const datasource = new DataSource(ormconfig);
export default datasource;
