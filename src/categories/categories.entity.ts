import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Identificador único de la categoría.',
    example: 'd3c2e567-8f70-4f12-b5ec-b9cbcd9f1d1c',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de la categoría. Debe ser único.',
    example: 'Electrónica',
  })
  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;
  
  @OneToMany(() => Products, (products) => products.category)
  products: Products[];
}
