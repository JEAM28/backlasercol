import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountService } from './code.service';
import { DiscountController } from './code.controller';
import { DiscountCode } from './code.entity';
import { Cart } from 'src/cart/cart.entity';
import { CartService } from 'src/cart/cart.service';
import { Products } from 'src/Products/products.entity';
import { Categories } from 'src/categories/categories.entity';
import { OrderDetails } from 'src/orders/orderdetails.entity';
import { Orders } from 'src/orders/orders.entity';
import { Users } from 'src/users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiscountCode,
      Cart,
      Products,
      Categories,
      OrderDetails,
      Orders,
      Users,
    ]),
  ],
  controllers: [DiscountController],
  providers: [DiscountService, CartService],
})
export class DiscountModule {}
