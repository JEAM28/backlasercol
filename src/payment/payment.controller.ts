import { Controller, Post, Body, Param } from '@nestjs/common';
import { PaypalService } from './payment.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('payments')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create')
  @ApiOperation({
    summary: "Crear una orden de pago con PayPal",
    description: `
      Esta ruta permite a los usuarios crear una orden de pago en PayPal. Se debe proporcionar la cantidad a pagar a través del cuerpo de la solicitud.
      La respuesta incluye el 'orderId' generado por PayPal y la URL de aprobación, la cual el usuario debe utilizar para completar el pago.
    `,
  })
  async createOrder(@Body('amount') amount: string) {
    const orderId = await this.paypalService.createOrder(amount);
    return { orderId };
  }

  @Post('capture/:orderId')
  @ApiOperation({
    summary: "Capturar una orden de pago en PayPal",
    description: `
      Esta ruta permite a los usuarios capturar el pago de una orden previamente creada en PayPal. El ID de la orden debe ser enviado como parámetro en la URL.
      Una vez que el pago ha sido capturado, la respuesta contiene los detalles del resultado de la captura.
    `,
  })
  async captureOrder(@Param('orderId') orderId: string) {
    const captureResult = await this.paypalService.captureOrder(orderId);

    return captureResult;

  }
}
