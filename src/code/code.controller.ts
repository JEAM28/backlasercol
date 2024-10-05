import { Controller, Post, Param } from '@nestjs/common';
import { DiscountService } from './code.service';
import { CartService } from 'src/cart/cart.service';

@Controller('discounts')
export class DiscountController {
  constructor(
    private readonly discountService: DiscountService,
    private readonly cartService: CartService,
  ) {}

  @Post('generate')
  async generateDiscountCode() {
    return this.discountService.createDiscountCode();
  }

  @Post(':cartId/:code')
  async applyDiscountCode(
    @Param('code') code: string,
    @Param('cartId') cartId: string,
  ): Promise<string> {
    const cart = await this.cartService.getCartById(cartId);
    const cartTotal = await this.cartService.calculateCartTotal(cartId);
    return this.discountService.applyDiscountCode(code, cartId, cartTotal);
  }
}
