import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercadoPago.service';
import { MercadoPagoController } from './mercadoPago.controller';

@Module({
    controllers: [MercadoPagoController],
    providers: [MercadoPagoService],
})
export class MercadoPagoModule {}
