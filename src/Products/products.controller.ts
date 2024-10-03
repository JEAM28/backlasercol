import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from './products.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Products")
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: "Obtener todos los productos",
    description: `
      Esta ruta busca todos los productos disponibles en la base de datos.
    `
  })
  getProducts(@Query('page') page: number, @Query('limit') limit: number) {
    if (page && limit) {
      return this.productsService.getProducts(page, limit);
    }
    return this.productsService.getProducts(1, 15);
  }

  @Get('name/:nombre')
  @ApiOperation({
    summary: "Obtener un producto por nombre",
    description: `
      Esta ruta busca la información detallada del producto específico mediante su nombre.
      Se espera recibir el nombre del producto en el parámetro de ruta 'nombre'.
    `
  })
  getProductByName(@Param('nombre') nombre: string) {
    return this.productsService.getProductByName(nombre);
  }

  @Get('category/:category')
  @ApiOperation({
    summary: "Obtener productos por categoría",
    description: `
      Esta ruta busca la información de los productos que pertenecen a una categoría específica.
      Se espera recibir la categoría del producto en el parámetro de ruta 'category'.
    `
  })
  getProductByCategory(@Param('category') category: string) {
    return this.productsService.getProductByCategory(category);
  }

  @Get(':id')
  @ApiOperation({
    summary: "Obtener producto por ID",
    description: `
      Esta ruta busca la información del producto cuyo ID coincida con el proporcionado.
      Se espera recibir el ID del producto en el parámetro de ruta 'id'.
    `
  })
  getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Agregar un nuevo producto",
    description: `
      Esta ruta permite agregar un nuevo producto a la base de datos. 
      Se debe enviar un objeto con los detalles del producto en el cuerpo de la solicitud.
      La ruta requiere autenticación mediante token Bearer.
      Solo los usuarios autenticados y autorizados pueden realizar esta operación.
    `
  })
  //@Roles(Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  addProduct(@Body() product: Partial<Products>) {
    return this.productsService.addProduct(product);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Editar un producto existente",
    description: `
      Esta ruta permite modificar los detalles de un producto existente, identificado por su ID.
      Se debe proporcionar el ID del producto en el parámetro de la URL y los cambios a realizar en el cuerpo de la solicitud.
      La ruta requiere autenticación mediante token Bearer y solo los administradores tienen permiso para realizar esta operación.
    `
  })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  editProduct(@Param('id') id: string, @Body() product: Partial<Products>) {
    return this.productsService.editProduct(id, product);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Eliminar un producto",
    description: `
      Esta ruta permite eliminar un producto de la base de datos, identificado por su ID.
      Se debe proporcionar el ID del producto en el parámetro de la URL.
      La ruta requiere autenticación mediante token Bearer y solo los administradores tienen permiso para realizar esta operación.
    `
  })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
