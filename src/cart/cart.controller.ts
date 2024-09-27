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

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('create')
  createCart(@Body('userId') userId?: string): Promise<Cart> {
    return this.cartService.createCart(userId);
  }

  @Get(':id')
  getCartById(@Param('id') cartId: string): Promise<Cart> {
    return this.cartService.getCartById(cartId);
  }

  @Post(':cartId/:productId')
  async addProductToCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ): Promise<CartResponse> {
    return this.cartService.addProductCart(cartId, productId);
  }

  @Patch(':cartId/:userId')
  async associateCartWithUser(
    @Param('cartId') cartId: string,
    @Param('userId') userId: string,
  ): Promise<Cart> {
    return this.cartService.associateCartWithUser(cartId, userId);
  }

  @Delete(':cartId/product/:productId')
  async removeProductFromCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeProductCart(cartId, productId);
  }
}
