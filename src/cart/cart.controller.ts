import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { CartResponse } from './cart.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags("Cart")
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('create')
  @ApiOperation({
    summary: "Crear un carrito",
    description: `
    Esta ruta permite crear un nuevo carrito. Opcionalmente, se puede asociar el carrito a un usuario proporcionando su 'userId'.
    `
  })
  createCart(@Body() body: { userId?: string }): Promise<Cart> {
      return this.cartService.createCart(body.userId);
  }  

  @Get(':id')
  @ApiOperation({
    summary: "Obtener un carrito por ID",
    description: `
    Esta ruta permite obtener los detalles de un carrito específico utilizando su 'id'.
    `
  })
  getCartById(@Param('id') cartId: string): Promise<Cart> {
    return this.cartService.getCartById(cartId);
  }

  @Post(':cartId/:productId')
  @ApiOperation({
    summary: "Añadir un producto al carrito",
    description: `
    Esta ruta permite añadir un producto a un carrito específico proporcionando los 'id' del carrito y del producto.
    `
  })
  async addProductToCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ): Promise<CartResponse> {
    return this.cartService.addProductCart(cartId, productId);
  }

  
  @Patch(':cartId/:userId')
  @ApiOperation({
    summary: "Asociar un carrito a un usuario",
    description: `
      Esta ruta permite asociar un carrito existente a un usuario específico proporcionando el 'id' del carrito y el 'id' del usuario.
    `
  })
  async associateCartWithUser(
    @Param('cartId') cartId: string,
    @Param('userId') userId: string,
  ): Promise<Cart> {
    return this.cartService.associateCartWithUser(cartId, userId);
  }

  @Delete(':cartId/product/:productId')
  @ApiOperation({
    summary: "Eliminar un producto del carrito",
    description: `
      Esta ruta permite eliminar un producto de un carrito específico utilizando los 'id' del carrito y del producto.
    `
  })
  async removeProductFromCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeProductCart(cartId, productId);
  }
}
