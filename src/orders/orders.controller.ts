import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Cart } from 'src/cart/cart.entity';
import { Orders } from './orders.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags("Orders")
@ApiBearerAuth()
@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: "Crear una nueva orden",
    description: `
      Esta ruta permite a los usuarios autenticados crear una nueva orden.
      Se debe proporcionar un cuerpo con el 'userId' del usuario y una lista de 'products' que serán parte de la orden.
    `
  })
  addOrder(@Body() order: any) {
    const { userId, products } = order;
    return this.ordersService.addOrder(userId, products);
  }

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
