import { Controller, Post, Param } from '@nestjs/common';
import { DiscountService } from './code.service';
import { CartService } from 'src/cart/cart.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('discounts')
export class DiscountController {
  constructor(
    private readonly discountService: DiscountService,
    private readonly cartService: CartService,
  ) {}

  @Post('generate')
  @ApiOperation({
    summary: "Generar un código de descuento",
    description: `
      Esta ruta permite generar un nuevo código de descuento con un porcentaje de descuento predefinido (15%). El código generado tiene una duración de 10 días antes de expirar.
      El código y su información de caducidad serán almacenados en la base de datos para futuras validaciones.
    `,
  })
  async generateDiscountCode() {
    return this.discountService.createDiscountCode();
  }

  @Post(':cartId/:code')
  @ApiOperation({
    summary: "Aplicar un código de descuento",
    description: `
      Esta ruta permite aplicar un código de descuento previamente generado a un carrito de compras específico. El código será validado para verificar si es válido, no ha caducado ni ha sido utilizado anteriormente.
      Se calcula el nuevo total del carrito aplicando el descuento correspondiente.
    `,
  })
  async applyDiscountCode(
    @Param('code') code: string,
    @Param('cartId') cartId: string,
  ): Promise<string> {
    const cart = await this.cartService.getCartById(cartId);
    const cartTotal = await this.cartService.calculateCartTotal(cartId);
    return this.discountService.applyDiscountCode(code, cartId, cartTotal);
  }
}
