import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { DiscountCode } from './code.entity';
import { addDays, formatDate } from 'date-fns';
import { format } from 'date-fns';
import { Cart } from 'src/cart/cart.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountCode)
    private readonly discountCodeRepository: Repository<DiscountCode>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  generateDiscountCode(length: number = 7): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  async createDiscountCode(): Promise<{
    code: string;
    id: number;
    createdAt: string;
    expiresAt: string;
  }> {
    const code = this.generateDiscountCode();
    const createdAt = new Date();

    const expiresAt = addDays(createdAt, 10);
    const discountCode = this.discountCodeRepository.create({
      code,
      discountPercentage: 15,
      createdAt,
      expiresAt,
    });

    await this.discountCodeRepository.save(discountCode);

    const localCreatedAt = createdAt.toLocaleString();
    const localExpiresAt = expiresAt.toLocaleString();

    return {
      code,
      id: discountCode.id,
      createdAt: localCreatedAt,
      expiresAt: localExpiresAt,
    };
  }

  async applyDiscountCode(
    cartId: string,
    code: string,
    cartTotal: number,
  ): Promise<string> {
    const discount = await this.discountCodeRepository.findOne({
      where: { code },
    });
    const now = new Date();

    if (!discount) {
      return 'Código de descuento no válido.';
    }

    if (discount.used) {
      return 'Este código ya ha sido utilizado.';
    }

    if (discount.expiresAt && discount.expiresAt < now) {
      return 'El código de descuento ha vencido.';
    }

    const cart = await this.cartRepository.findOneBy({ id: cartId });
    if (cart) {
      discount.cart = cart;
      await this.discountCodeRepository.save(discount);
    }

    discount.used = true;
    await this.discountCodeRepository.save(discount);

    const discountAmount = (cartTotal * discount.discountPercentage) / 100;
    const newTotal = cartTotal - discountAmount;
    return `${newTotal}`;
  }
}
