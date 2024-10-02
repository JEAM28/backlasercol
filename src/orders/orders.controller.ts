import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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
  constructor(private readonly ordersService: OrdersService) {}

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

  @Get(':id')
  @ApiOperation({
    summary: "Obtener una orden por ID",
    description: `
      Esta ruta permite a los usuarios autenticados obtener los detalles de una orden específica utilizando su 'id'.
    `
  })
  getOrder(@Query('id') id: string) {
    return this.ordersService.getOrder(id);
  }
}
