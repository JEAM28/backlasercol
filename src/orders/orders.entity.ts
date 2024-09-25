import { Users } from 'src/users/users.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetails } from './orderdetails.entity';

@Entity({
  name: 'ORDERS',
})
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order)
  orderDetails: OrderDetails;

  @ManyToOne(() => Users, (user) => user.orders)
  user: Users;
}
