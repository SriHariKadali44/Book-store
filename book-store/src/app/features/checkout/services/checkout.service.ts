import { Injectable, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Address } from '../../../shared/models/address.model';
import { CheckoutState, ShippingMethod, PlaceOrderDto } from '../../../shared/models/checkout.model';
import { Order } from '../../../shared/models/order.model';
import { Cart } from '../../../shared/models/cart.model';
import { formatDateForApi } from '../../../shared/utils/format-date.util';

const EMPTY_STATE: CheckoutState = { address: null, shippingMethod: null, paymentToken: null, step: 1 };

const MOCK_SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'std',   name: 'Standard Shipping',   description: '5–7 business days',    price: 4.99,  estimatedDays: 7 },
  { id: 'exp',   name: 'Express Shipping',    description: '2–3 business days',    price: 9.99,  estimatedDays: 3 },
  { id: 'next',  name: 'Next Day Delivery',   description: 'Order before 2pm',     price: 19.99, estimatedDays: 1 },
  { id: 'free',  name: 'Free Shipping',       description: '7–10 business days',   price: 0,     estimatedDays: 10 },
];

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly _state = signal<CheckoutState>({ ...EMPTY_STATE });
  readonly checkoutState = this._state.asReadonly();

  setAddress(address: Address): void {
    this._state.update(s => ({ ...s, address, step: 2 }));
  }

  setShippingMethod(method: ShippingMethod): void {
    this._state.update(s => ({ ...s, shippingMethod: method, step: 3 }));
  }

  setPaymentToken(token: string): void {
    this._state.update(s => ({ ...s, paymentToken: token, step: 4 }));
  }

  getShippingMethods(): Observable<ShippingMethod[]> {
    return of(MOCK_SHIPPING_METHODS);
  }

  placeOrder(cart: Cart): Observable<Order> {
    const state = this._state();
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (state.shippingMethod?.estimatedDays ?? 7));

    const order: Order = {
      id: `ORD-${Date.now()}`,
      userId: 'current-user',
      items: cart.items.map(i => ({
        bookId:   i.bookId,
        title:    i.title,
        coverUrl: i.coverUrl,
        price:    i.price,
        quantity: i.quantity,
        format:   i.format,
      })),
      shippingAddress: state.address!,
      shippingMethod: {
        id:    state.shippingMethod!.id,
        name:  state.shippingMethod!.name,
        price: state.shippingMethod!.price,
      },
      paymentSummary: { last4: '4242', brand: 'Visa' },
      subtotal: cart.subtotal,
      discount: cart.discount,
      tax:      cart.tax,
      total:    cart.total,
      status:   'confirmed',
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Spec: use formatDateForApi for any date fields in the request payload
    const _dto: PlaceOrderDto = {
      shippingAddressId: state.address!.id,
      shippingMethodId:  state.shippingMethod!.id,
      paymentToken:      state.paymentToken!,
      expectedDeliveryDate: formatDateForApi(deliveryDate),
    };

    return of(order).pipe(delay(1200));
  }

  resetCheckout(): void {
    this._state.set({ ...EMPTY_STATE });
  }
}
