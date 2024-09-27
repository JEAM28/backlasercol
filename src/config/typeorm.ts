import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Users } from 'src/users/users.entity';
import { Products } from 'src/Products/products.entity';
import { Cart } from 'src/cart/cart.entity';
import { OrderDetails } from 'src/orders/orderdetails.entity';
import { Orders } from 'src/orders/orders.entity';
import { Categories } from 'src/categories/categories.entity';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: `${process.env.DB_PORT}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [__dirname + '/typeorm/entities/*.{ts,js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: true,
  logging: false,
  autoLoadEntities: true,
  dropSchema: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
