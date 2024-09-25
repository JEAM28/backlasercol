import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/Products/products.entity';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Orders } from './orders.entity';
import { OrderDetails } from './orderdetails.entity';

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
  ) {}

  async addOrder(userId: string, products: any) {
    let total = 0;
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('usuario no encontrado');
    }

    const order = new Orders();
    order.date = new Date();
    order.user = user;

    const newOrder = await this.ordersRepository.save(order);

    const productsArray = await Promise.all(
      products.map(async (element) => {
        const product = await this.productsRepository.findOneBy({
          id: element.id,
        });

        if (!product) {
          throw new NotFoundException();
        }

        total += Number(product.valor);

        await this.productsRepository.update(
          { id: element.id },
          { stock: product.stock - 1 },
        );

        return product;
      }),
    );

    const orderDetail = new OrderDetails();

    orderDetail.price = Number(Number(total).toFixed(2));
    orderDetail.products = productsArray;
    orderDetail.order = newOrder;

    await this.orderDetailsRepository.save(orderDetail);

    return await this.ordersRepository.find({
      where: { id: newOrder.id },
      relations: {
        orderDetails: true,
      },
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
}
