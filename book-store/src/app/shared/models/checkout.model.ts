import { Address } from './address.model';

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
}

export type CheckoutStep = 1 | 2 | 3 | 4;

export interface CheckoutState {
  address: Address | null;
  shippingMethod: ShippingMethod | null;
  paymentToken: string | null;
  step: CheckoutStep;
}

/** DTO sent to POST /orders — dates must use formatDateForApi. */
export interface PlaceOrderDto {
  shippingAddressId: string;
  shippingMethodId: string;
  paymentToken: string;
  expectedDeliveryDate?: string;   // yyyy-MM-dd via formatDateForApi
}
