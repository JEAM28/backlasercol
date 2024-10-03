import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/categories/categories.entity';
import { Orders } from 'src/orders/orders.entity';
import { Products } from 'src/Products/products.entity';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { OrderDetails } from 'src/orders/orderdetails.entity';
import { CartResponse } from './cart.interface';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderDetails)
    private orderDetailsRepository: Repository<OrderDetails>,
  ) {}

  async createCart(userId?: string): Promise<Cart> {
    if (!userId) {
        throw new BadRequestException('userId is required');
    }

    const newCart = this.cartRepository.create();
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
        throw new NotFoundException('Usuario no encontrado');
    }

    newCart.users = user;
    return await this.cartRepository.save(newCart);
}


  async addProductCart(
    cartId: string,
    productId: string,
  ): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: { products: true },
    });
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: { category: true },
    });

    if (!cart) {
      throw new BadRequestException('carrito no encontrado');
    }
    const products = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!products) {
      throw new NotFoundException('Producto no encontrado');
    }

    cart.products.push(product);
    await this.cartRepository.save(cart);

    const total = await this.calculateCartTotal(cartId);
    return {
      cart,
      total,
    };
  }

  async calculateCartTotal(cartId: string): Promise<number> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: { products: true },
    });

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    const total = cart.products.reduce(
      (sum, product) => sum + product.valor,
      0,
    );

    return total;
  }

  async getCartById(userId: string): Promise<Cart> {
    const cartFound = await this.cartRepository.findOne({
      where: { usersId: userId }, // Now you can safely use `usersId`
      relations: { products: true },
    });
    return cartFound;
  }
  

  async mergeCart(cartId: string, userId: string): Promise<Cart> {
    const cart = await this.getCartById(cartId);
    if (cart.users) {
      throw new Error('el carrito ya esta asociado al usuario');
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('usuario no encontrado');
    }
    cart.users = user;
    return this.cartRepository.save(cart);
  }

  async createOrderFromCart(cartId: string): Promise<Orders> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: { products: true, users: true },
    });
    if (!cart) {
      throw new NotFoundException('carrito no encontrado');
    }
    if (cart.products.length === 0) {
      throw new Error('el carrito esta vacio');
    }

    const order = new Orders();
    order.date = new Date();
    order.user = cart.users;

    const newOrder = await this.ordersRepository.save(order);

    const orderDetail = new OrderDetails();
    orderDetail.products = cart.products;
    orderDetail.price = this.calculeTotal(cart.products);
    orderDetail.order = newOrder;
    await this.orderDetailsRepository.save(orderDetail);

    cart.isPurchased = true;
    cart.products = [];
    await this.cartRepository.save(cart);
    return newOrder;
  }
  private calculeTotal(products: Products[]): number {
    return products.reduce((total, product) => total + +product.valor, 0);
  }

  async associateCartWithUser(cartId: string, userId: string): Promise<Cart> {
    const cart = await this.getCartById(cartId);

    if (cart.users) {
      throw new Error('El carrito ya está asociado a un usuario');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    cart.users = user;

    return this.cartRepository.save(cart);
  }

  async removeProductCart(cartId: string, productId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: { products: true },
    });
    if (!cart) {
      throw new NotFoundException('carrito no encontrado');
    }

    const productIndex = cart.products.findIndex(
      (article) => article.id === productId,
    );
    if (productIndex === -1) {
      throw new NotFoundException('Producto no encontrado en el carrito');
    }

    cart.products.splice(productIndex, 1);
    return this.cartRepository.save(cart);
  }
}
