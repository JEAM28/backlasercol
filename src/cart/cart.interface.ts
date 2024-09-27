import { Cart } from './cart.entity';

export interface CartResponse {
  cart: Cart;
  total: number;
}
