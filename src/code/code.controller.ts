import { Controller, Post, Body, Param } from '@nestjs/common';
import { DiscountService } from './code.service';

@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post('generate')
  async generateDiscountCode() {
    return this.discountService.createDiscountCode();
  }

  @Post(':apply/:code')
  async applyDiscountCode(
    @Param('code') code: string,
    @Body('cartTotal') cartTotal: number,
  ) {
    return this.discountService.applyDiscountCode(code, cartTotal);
  }
}
