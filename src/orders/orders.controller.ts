import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Cart } from 'src/cart/cart.entity';
import { Orders } from './orders.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './orders.dto';
@ApiTags("Orders")
@ApiBearerAuth()
@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService
  ) {}


  @Post('create-from-cart/:userId')
  @ApiOperation({
    summary: "Crear una orden basada en el carrito del usuario",
    description: `
      Esta ruta permite a los usuarios autenticados crear una orden utilizando todos los productos en su carrito actual.
      Se debe proporcionar el 'userId' del usuario como parámetro en la URL.
    `,
  })
  async createOrderFromCart(@Param('userId') userId: string) {
    // Llama al servicio para crear la orden basada en el carrito
    return this.ordersService.createOrderFromCart(userId);
  }


  @Get(':id')
  @ApiOperation({
    summary: "Obtener una orden por ID",
    description: `
      Esta ruta permite a los usuarios autenticados obtener los detalles de una orden específica utilizando su 'id'.
      El ID de la orden debe ser enviado como parámetro en la URL. La respuesta incluirá información detallada de la orden, 
      como los productos comprados, la fecha de creación y el estado actual de la orden.
    `,
  })
  getOrder(@Query('id') id: string) {
    return this.ordersService.getOrder(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: "Marcar una orden como recibida",
    description: `
      Esta ruta permite a los usuarios cambiar el estado de una orden a "Recibido". Se debe proporcionar el 'id' de la orden 
      como parámetro en la URL. La orden debe estar en estado "Enviado" para que esta acción sea exitosa.
    `,
  })
  async markAsReceived(@Param('id') orderId: string): Promise<string> {
    return await this.ordersService.changeOrderStatus(orderId);
  }

  @Get("userorder/:id")
  @ApiOperation({
    summary: "Obtener todas las órdenes de un usuario",
    description: `
      Esta ruta permite a los usuarios autenticados obtener todas las órdenes asociadas a su cuenta utilizando su 'id'.
      El ID del usuario se proporciona como parámetro en la URL y la respuesta incluirá una lista de todas sus órdenes, 
      junto con detalles como el estado, los productos y la fecha de cada orden.
    `,
  })
  getUserOders(@Param('id') userId: string) {
    return this.ordersService.getOrdersByUserId(userId);
  }
}




  //@Post()
  //@ApiOperation({
  //  summary: "Crear una nueva orden",
  //  description: `
  //    Esta ruta permite a los usuarios autenticados crear una nueva orden.
  //    Se debe proporcionar un cuerpo con el 'userId' del usuario y una lista de 'products' que serán parte de la orden.
  //  `
  //})
  //@ApiBody({
  //  description: 'Objeto que contiene el userId y una lista de productos',
  //  schema: {
  //    type: 'object',
  //    properties: {
  //      userId: { type: 'string', example: 'd3b07384-d9b8-4f2f-9fa7-9a7d4c55c4f8' },
  //      products: {
  //        type: 'array',
  //        items: {
  //          type: 'object',
  //          properties: {
  //            id: { type: 'string', example: 'f4b673aa-4d63-47d2-9442-1f64cfe4a1b7' }
  //          }
  //        },
  //        example: [
  //          { id: 'f4b673aa-4d63-47d2-9442-1f64cfe4a1b7' },
  //          { id: 'a1f56d78-3c3e-40db-9e9f-2a51c4f0e2a6' }
  //        ]
  //      }
  //    }
  //  }
  //})
  //addOrder(@Body() order: CreateOrderDto) {
  //  const { userId, products } = order;
  //  return this.ordersService.addOrder(userId, products);
  //}
