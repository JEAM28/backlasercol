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
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'ORDER_DETAILS',
})
export class OrderDetails {
  @ApiHideProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Precio total de los productos en el detalle de la orden, con dos decimales.',
    example: 199.99,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @ApiHideProperty()
  @OneToOne(() => Orders, (order) => order.orderDetails)
  order: Orders;

  @ApiProperty({
    description: 'Lista de productos asociados a este detalle de la orden.',
    type: [Products],
    example: [
      {
        id: 'f4a45dce-e4e6-42e4-a9d6-2c7b34d235eb',
        nombre: 'Taza',
        color: 'Blanco',
        material: 'Cerámica',
        medidas: '10x8 cm',
        stock: 20,
        valor: 12.99,
        imgUrl: 'default-image-url.jpg',
        category: {
          id: '12e7f8f2-59b8-4bb5-aad6-e75a1d567b35',
          nombre: 'Hogar',
        },
      },
    ],
  })
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
