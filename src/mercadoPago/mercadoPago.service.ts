import { Injectable } from '@nestjs/common';
import * as mercadopago from 'mercadopago';

@Injectable()
export class MercadoPagoService {
    constructor() {

    }

    async crearPago(body) {
     
        
       let preference = await new mercadopago.Preference(new mercadopago.MercadoPagoConfig({
            accessToken: 'APP_USR-7984229319480021-100901-7d9fc0c89f21ac16b0d0a9ce65a30490-2017306155',
        })).create({body})
      
        
        return {id:preference.id}
    }
}
