import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/Products/products.entity';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Orders } from './orders.entity';
import { OrderDetails } from './orderdetails.entity';
import { CartService } from 'src/cart/cart.service'; // Make sure to import the CartService

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderDetails)
    private orderDetailsRepository: Repository<OrderDetails>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private cartService: CartService, // Inject CartService here
  ) {}

  async createOrderFromCart(userId: string) {
    // Obtener el usuario
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Obtener el carrito del usuario
    const cart = await this.cartService.getCartById(userId); // Use cartService here
    if (!cart || !cart.products || cart.products.length === 0) {
      throw new NotFoundException('El carrito está vacío o no existe');
    }

    // Crear la orden
    const order = new Orders();
    order.date = new Date();
    order.user = user;
    order.cart = cart; // Asociar el carrito a la orden

    // Guardar la orden
    const newOrder = await this.ordersRepository.save(order);

    // Calcular el total y crear los detalles de la orden
    let total = 0;
    const productsArray = await Promise.all(
      cart.products.map(async (product) => {
        const productDetails = await this.productsRepository.findOneBy({ id: product.id });
        if (!productDetails || productDetails.stock <= 0) {
          throw new BadRequestException(`Producto ${product.id} no disponible`);
        }
        total += Number(productDetails.valor);

        // Actualizar stock
        await this.productsRepository.update(
          { id: product.id },
          { stock: productDetails.stock - 1 }
        );

        return productDetails;
      })
    );

    const orderDetail = new OrderDetails();
    orderDetail.price = total;
    orderDetail.products = productsArray;
    orderDetail.order = newOrder;

    // Guardar los detalles de la orden
    await this.orderDetailsRepository.save(orderDetail);

    // Retornar la orden con detalles
    return await this.ordersRepository.findOne({
      where: { id: newOrder.id },
      relations: ['orderDetails', 'orderDetails.products'],
    });
  }

  getOrder(id: string) {
    const order = this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException();
    }
    return order;
  }

  async changeOrderStatus(orderId: string): Promise<string> {
    const order = await this.ordersRepository.findOneBy({ id: orderId });

    if (!order) {
      throw new NotFoundException('La orden no fue encontrada.');
    }

    if (order.status === 'Recibido') {
      throw new BadRequestException('La orden ya ha sido recibida.');
    }

    order.status = 'Recibido';
    await this.ordersRepository.save(order);

    return 'El estado de la orden ha sido actualizado a Recibido.';
  }

  async getOrdersByUserId(userId: string): Promise<Orders[]> {
    const orders = await this.ordersRepository.find({
      where: { user: { id: userId } },
    });

    if (orders.length === 0) {
      throw new NotFoundException('No se encontraron órdenes para el usuario.');
    }

    return orders;
  }
}




//async addOrder(userId: string, products: any) {
//  let total = 0;
//  const user = await this.usersRepository.findOneBy({ id: userId });
//
//  if (!user) {
//    throw new NotFoundException('Usuario no encontrado');
//  }
//
//  const order = new Orders();
//  order.date = new Date();
//  order.user = user;
//
//  // Guardar la nueva orden primero
//  const newOrder = await this.ordersRepository.save(order);
//
//  const productsArray = await Promise.all(
//    products.map(async (element) => {
//      const product = await this.productsRepository.findOneBy({ id: element.id });
//
//      if (!product) {
//        throw new NotFoundException(`Producto con ID ${element.id} no encontrado`);
//      }
//
//      // Devolver el producto para la asociación en OrderDetails
//      return product;
//    }),
//  );
//
//  // Revisar el stock después de recoger todos los productos
//  productsArray.forEach((product) => {
//    if (product.stock <= 0) {
//      throw new Error(`El producto con ID ${product.id} no tiene suficiente stock`);
//    }
//  });
//
//  // Actualizar el stock y calcular el total
//  for (const product of productsArray) {
//    total += Number(product.valor);
//
//    // Actualizamos el stock
//    await this.productsRepository.update(
//      { id: product.id },
//      { stock: product.stock - 1 }, // Asegúrate de que esto es correcto
//    );
//  }
//
//  // Crear el detalle de la orden
//  const orderDetail = new OrderDetails();
//  orderDetail.price = Number(Number(total).toFixed(2)); // Precio total de todos los productos
//  orderDetail.products = productsArray; // Asociar productos a los detalles
//  orderDetail.order = newOrder; // Asociar la orden al detalle
//
//  // Guardar el detalle de la orden
//  await this.orderDetailsRepository.save(orderDetail);
//
//  // Devolver la orden con sus detalles
//  return await this.ordersRepository.findOne({
//    where: { id: newOrder.id },
//    relations: ['orderDetails', 'orderDetails.products'], // Asegúrate de que estas relaciones están configuradas
//  });
//}

