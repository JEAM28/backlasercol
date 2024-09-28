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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isPurchased: boolean;

  @OneToMany(() => Products, (products) => products.cart)
  products: Products[];

  @OneToOne(() => Users, (users) => users.cart)
  @JoinColumn()
  users: Users;

  @Column({ nullable: true }) // Add this line to define the foreign key explicitly
  usersId: string;  // This will store the actual `userId`
  
  @OneToMany(() => Orders, (orders) => orders.cart)
  orders: Orders[];
}
