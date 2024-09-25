import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: `${process.env.DB_PORT}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: true,
  logging: false,
  autoLoadEntities: true,
  dropSchema: false,
};
console.log(process.env.DB_HOST);

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
