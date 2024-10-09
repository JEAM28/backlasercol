import { Controller, Post, Body, Param } from '@nestjs/common';
import { PaypalService } from './payment.service';

@Controller('payments')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create')
  async createOrder(@Body('amount') amount: string) {
    const orderId = await this.paypalService.createOrder(amount);
    return { orderId }; // Retorna el ID de la orden
  }

  @Post('capture/:orderId')
  async captureOrder(@Param('orderId') orderId: string) {
    const captureResult = await this.paypalService.captureOrder(orderId);
    return captureResult; // Retorna el resultado de la captura
  }
}
