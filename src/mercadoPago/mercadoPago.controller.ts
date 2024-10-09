import { Controller, Post, Body } from '@nestjs/common';
import { MercadoPagoService } from './mercadoPago.service';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post('crear-preferencia')
  async crearPreferencia(@Body() body) {
    const preferencia = {
      items: body.items.map((item) => {
        return {
          title: item.titulo,
          quantity: item.cantidad,
          unit_price: Number(item.precio),
          picture_url: item.image,
        };
      }),
      payer: {
        email: body.email,
      },

      back_urls: {
        success: 'https://lasercol.vercel.app',
      },
      auto_return: 'approved',
    };

    const response = await this.mercadoPagoService.crearPago(preferencia);
    return response;
  }
}
