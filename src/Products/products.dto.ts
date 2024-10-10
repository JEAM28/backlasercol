import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsPositive,
  MaxLength,
  Min,
  IsDecimal,
} from 'class-validator';
import { Categories } from 'src/categories/categories.entity';

export class CreateProductDTO {
  @ApiProperty({
    description: 'Debe ser un string de máximo 50 caracteres.',
    example: 'Taza de cerámica',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nombre: string;

  @ApiProperty({
    description: 'Color del producto',
    example: 'Rojo',
  })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({
    description: 'Material del producto, especificar el tipo de material.',
    example: 'Cerámica',
  })
  @IsNotEmpty()
  @IsString()
  material: string;

  @ApiProperty({
    description: 'Medidas del producto, incluyendo unidades (cm, pulgadas, etc.).',
    example: '10cm x 8cm x 8cm',
  })
  @IsNotEmpty()
  @IsString()
  medidas: string;

  @ApiProperty({
    description: 'Cantidad de productos disponibles en inventario.',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({
    description: 'Precio del producto con dos decimales de precisión.',
    example: 48000.00,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valor: number;

  @ApiProperty({
    description: 'URL de la imagen del producto. Si no se proporciona, se asigna una imagen por defecto.',
    example: 'https://example.com/images/taza.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imgUrl?: string;

  @ApiProperty({
    description: 'UUID de la categoría a la que pertenece el producto.',
    example: 'c4b5d8f0-e3af-44f3-bb2f-9b0b3e845a3e',
  })
  @IsNotEmpty()
  @IsUUID() // Especifica que debe ser un UUID válido
  category: string;
}
