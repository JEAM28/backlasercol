import { Users } from 'src/users/users.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetails } from './orderdetails.entity';
import { Cart } from 'src/cart/cart.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'ORDERS',
})
export class Orders {
  @ApiProperty({
    description: 'Identificador único de la orden.',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Fecha en que se realizó la orden.',
    example: '2024-09-29T10:00:00Z',
  })
  @Column()
  date: Date;

  @ApiProperty({
    description: 'Detalles de la orden.',
  })
  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order)
  orderDetails: OrderDetails;

  @ApiProperty({
    description: 'Usuario que realizó la orden.',
  })
  @ManyToOne(() => Users, (user) => user.orders)
  user: Users;

  @ApiProperty({
    description: 'Carrito asociado a la orden.',
  })
  @ManyToOne(() => Cart, (cart) => cart.orders)
  cart: Cart;
}
