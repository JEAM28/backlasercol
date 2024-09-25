import { Products } from 'src/Products/products.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'CATEGORYS',
})
export class Categories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @OneToMany(() => Products, (products) => products.category)
  @JoinColumn()
  products: Products[];
}
