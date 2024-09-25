import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from './orderdetails.entity';
import { Orders } from './orders.entity';
import { Users } from 'src/users/users.entity';
import { Products } from 'src/Products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetails, Orders, Users, Products])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
