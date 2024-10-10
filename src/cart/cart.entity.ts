import { ApiProperty } from '@nestjs/swagger';
import { DiscountCode } from 'src/code/code.entity';
import { Orders } from 'src/orders/orders.entity';
import { Products } from 'src/Products/products.entity';
import { Users } from 'src/users/users.entity';
import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity({
  name: 'CART',
})
export class Cart {
  @ApiProperty({
    description: 'Identificador único del carrito.',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  total: number;


  @Column({ nullable: false })
  quantity?: number;

  @Column({ nullable: true })
  discountCode?: string;

  @ApiProperty({
    description: 'Indica si el carrito ha sido comprado.',
    example: false,
  })
  @Column({ default: false })
  isPurchased: boolean;

  @Column({ nullable: true })
  usersId: string;

  @ApiProperty({
    description: 'Lista de productos en el carrito.',
  })
  @OneToMany(() => Products, (products) => products.cart)
  products: Products[];

  @ApiProperty({
    description: 'Usuario propietario del carrito.',
  })
  @OneToOne(() => Users, (users) => users.cart)
  @JoinColumn()
  users: Users;

  @ApiProperty({
    description: 'Lista de órdenes asociadas al carrito.',
  })
  @OneToMany(() => Orders, (orders) => orders.cart)
  orders: Orders[];

  @OneToOne(() => DiscountCode, (discountCode) => discountCode.cart)
  discountCodes: DiscountCode;
}
