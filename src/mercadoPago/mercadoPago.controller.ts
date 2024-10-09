import { Controller, Post, Body } from '@nestjs/common';
import { MercadoPagoService } from './mercadoPago.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

    @Post('crear-preferencia')
    @ApiOperation({
        summary: "Crear una preferencia de pago en MercadoPago",
        description: `
          Esta ruta permite crear una preferencia de pago en MercadoPago, recibiendo los detalles de los productos a través del cuerpo de la solicitud ('body'). 
          Los detalles incluyen los ítems a comprar (título, cantidad, precio unitario) y el correo electrónico del comprador. 
          También se define una URL de retorno para redirigir al usuario una vez finalizado el pago.
        `,
      })
    async crearPreferencia(@Body() body) {     

        const preferencia = {
            items: body.items.map(item => {
                return ({
                    title: item.titulo,
                    quantity: item.cantidad,
                    unit_price: Number(item.precio),
                    picture_url: item.image
                })
            }),
            payer: {
                email: body.email
            }

            ,
            back_urls: {
                success: 'https://lasercol.vercel.app',
            },
            auto_return: 'approved',

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
