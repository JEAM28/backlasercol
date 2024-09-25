import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './orders.entity';
import { Products } from 'src/Products/products.entity';

@Entity({
  name: 'ORDER_DETAILS',
})
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @OneToOne(() => Orders, (order) => order.orderDetails)
  order: Orders;

  @ManyToMany(() => Products)
  @JoinTable({
    name: 'orderDetails_products',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'orderdetail_id',
      referencedColumnName: 'id',
    },
  })
  products: Products[];
}
