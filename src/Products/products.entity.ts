import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Cart } from '../cart/cart.entity';
import { Categories } from 'src/categories/categories.entity';
import { OrderDetails } from 'src/orders/orderdetails.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'PRODUCTS',
})
export class Products {
  @ApiHideProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Debe ser un string de máximo 50 caracteres.',
    example: 'Taza de cerámica',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  nombre: string;

  @ApiProperty({
    description: 'Color del producto',
    example: 'Rojo',
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  color: string;

  @ApiProperty({
    description: 'Material del producto, especificar el tipo de material.',
    example: 'Cerámica',
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  material: string;

  @ApiProperty({
    description:
      'Medidas del producto, incluyendo unidades (cm, pulgadas, etc.).',
    example: '10cm x 8cm x 8cm',
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  medidas: string;

  @ApiProperty({
    description: 'Cantidad de productos disponibles en inventario.',
    example: 10,
  })
  @Column({
    type: 'int',
    nullable: false,
  })
  stock: number;

  @ApiProperty({
    description: 'Precio del producto con dos decimales de precisión.',
    example: 19.99,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  valor: number;

  @ApiProperty({
    description:
      'URL de la imagen del producto. Si no se proporciona, se asigna una imagen por defecto.',
    example: 'https://example.com/images/taza.jpg',
  })
  @Column({
    type: 'varchar',
    length: 255,
    default: 'default-image-url.jpg',
  })
  imgUrl: string;
  @Column({
    nullable: true,
  })
  customMessage: string;

  @ApiHideProperty()
  @ManyToOne(() => Cart, (cart) => cart.products)
  cart: Cart;

  @ApiHideProperty()
  @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.products)
  orderDetail: OrderDetails[];

  @ApiProperty({
    description: 'Categoría a la que pertenece el producto.',
    example: 'Hogar',
  })
  @ManyToOne(() => Categories, (category) => category.products)
  @JoinColumn({
    name: 'category',
  })
  category: Categories;
}
