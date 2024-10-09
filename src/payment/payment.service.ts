import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PaypalService {
  private client: paypal.core.PayPalHttpClient;

  constructor() {
    const environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET,
    );
    this.client = new paypal.core.PayPalHttpClient(environment);
  }

  async createOrder(amount: string) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
          },
        },
      ],
      application_context: {
        return_url: 'https://www.sandbox.paypal.com.', // Redirige aquí tras aprobación
        // Redirige aquí si se cancela
      },
    });

    const order = await this.client.execute(request);

    // Devuelve el enlace de aprobación al frontend
    const approvalUrl = order.result.links.find(
      (link) => link.rel === 'approve',
    ).href;
    return { orderId: order.result.id, approvalUrl };
  }
  async captureOrder(orderId: string): Promise<any> {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await this.client.execute(request);
    return response.result; // Devuelve el resultado de la captura
  }
}
