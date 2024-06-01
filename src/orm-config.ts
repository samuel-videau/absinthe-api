import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
config();

export const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: true,
};

const datasource = new DataSource(ormconfig);
export default datasource;
