import { Orders } from 'src/orders/orders.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'USERS',
})
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  Dni: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  birthDate: Date;

  @Column({
    type: 'int',
  })
  phone: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  city: string;

  @Column({
    type: 'text',
  })
  address: string;

  @OneToMany(() => Orders, (order) => order.user)
  @JoinColumn({ name: 'orders_id' })
  orders: Orders[];
}
