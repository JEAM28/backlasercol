import { Orders } from 'src/orders/orders.entity';
import { Products } from 'src/Products/products.entity';
import { Users } from 'src/users/users.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'CART',
})
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isPurchased: boolean;

  @OneToMany(() => Products, (products) => products.cart)
  products: Products[];

  @ManyToOne(() => Users, (users) => users.cart)
  users: Users;

  @OneToMany(() => Orders, (orders) => orders.cart)
  orders: Orders[];
}
