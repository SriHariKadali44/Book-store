import { BookFormat } from './book.model';
import { Address } from './address.model';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  bookId: string;
  title: string;
  coverUrl: string;
  price: number;
  quantity: number;
  format: BookFormat;
}

export interface PaymentSummary {
  last4: string;
  brand: string;   // e.g. 'Visa', 'Mastercard'
}

export interface ShippingMethodRef {
  id: string;
  name: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  shippingMethod: ShippingMethodRef;
  paymentSummary: PaymentSummary;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  placedAt: string;    // ISO 8601 — display only; use formatDateForApi for API requests
  updatedAt: string;   // ISO 8601
}
