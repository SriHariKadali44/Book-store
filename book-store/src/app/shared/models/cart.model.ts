import { BookFormat } from './book.model';

export interface CartItem {
  bookId: string;
  title: string;
  coverUrl: string;
  price: number;
  quantity: number;
  format: BookFormat;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  isValid: boolean;
}
