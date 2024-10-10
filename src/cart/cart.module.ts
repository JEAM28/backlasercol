import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from 'src/orders/orderdetails.entity';
import { Orders } from 'src/orders/orders.entity';
import { Users } from 'src/users/users.entity';
import { Products } from 'src/Products/products.entity';
import { Cart } from './cart.entity';
import { Categories } from 'src/categories/categories.entity';
import { DiscountCode } from 'src/code/code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderDetails,
      Orders,
      Users,
      Products,
      Cart,
      Categories,
      DiscountCode,
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
