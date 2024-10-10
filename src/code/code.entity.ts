import { Cart } from 'src/cart/cart.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'DISCOUNT_CODE' })
export class DiscountCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column('decimal')
  discountPercentage: number;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;

  @OneToOne(() => Cart, (cart) => cart.discountCode)
  cart: Cart;
}
