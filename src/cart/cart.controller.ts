import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { CartResponse } from './cart.interface';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Orders } from 'src/orders/orders.entity';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Crear un carrito',
    description: `
    Esta ruta permite crear un nuevo carrito. Opcionalmente, se puede asociar el carrito a un usuario proporcionando su 'userId'.
    `,
  })
  @ApiBody({
    description: 'Objeto opcional con el userId',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: '123456' },
      },
    },
  })
  createCart(@Body() body: { userId?: string }): Promise<Cart> {
    return this.cartService.createCart(body.userId);
  }

  @Get(':userId/orders')
  async getOrdersByUserId(@Param('userId') userId: string): Promise<Orders[]> {
    return this.cartService.getOrdersByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un carrito por ID',
    description: `
    Esta ruta permite obtener los detalles de un carrito específico utilizando su 'id'.
    `,
  })
  getCartById(@Param('id') cartId: string): Promise<Cart> {
    return this.cartService.getCartById(cartId);
  }

  @Post(':cartId/:productId')
  @ApiOperation({
    summary: 'Añadir un producto al carrito',
    description: `
    Esta ruta permite añadir un producto a un carrito específico proporcionando los 'id' del carrito y del producto.
    `,
  })
  async addProductToCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ): Promise<CartResponse> {
    return this.cartService.addProductCart(cartId, productId, quantity);
  }

  @Patch(':cartId/:userId')
  @ApiOperation({
    summary: 'Asociar un carrito a un usuario',
    description: `
      Esta ruta permite asociar un carrito existente a un usuario específico proporcionando el 'id' del carrito y el 'id' del usuario.
    `,
  })
  async associateCartWithUser(
    @Param('cartId') cartId: string,
    @Param('userId') userId: string,
  ): Promise<Cart> {
    return this.cartService.associateCartWithUser(cartId, userId);
  }

  @Delete(':cartId/product/:productId')
  @ApiOperation({
    summary: 'Eliminar un producto del carrito',
    description: `
      Esta ruta permite eliminar un producto de un carrito específico utilizando los 'id' del carrito y del producto.
    `,
  })
  async removeProductFromCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeProductCart(cartId, productId);
  }

  @Post(':cartId/order')
  async createOrderFromCart(@Param('cartId') cartId: string): Promise<Orders> {
    return this.cartService.createOrderFromCart(cartId);
  }
}
