import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { Order } from '../../../shared/models/order.model';
import { BookSummary } from '../../../shared/models/book.model';
import { Address, AddressPayload } from '../../../shared/models/address.model';
import { PagedResult } from '../../../shared/models/pagination.model';
import { MOCK_FEATURED_BOOKS } from '../../home/services/home.service.mock';

const MOCK_USER: User = {
  id: 'u-shopper',
  email: 'shopper@bookstore.com',
  firstName: 'Jane',
  lastName: 'Reader',
  role: 'shopper',
  createdAt: '2023-01-15T00:00:00Z',
};

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    userId: 'u-shopper',
    items: [
      { bookId: 'book-1', title: 'The Midnight Library', coverUrl: '', price: 12.99, quantity: 1, format: 'paperback' },
      { bookId: 'book-2', title: 'Atomic Habits',        coverUrl: '', price: 19.99, quantity: 1, format: 'hardcover' },
    ],
    shippingAddress: { id: 'addr-1', label: 'Home', fullName: 'Jane Reader', street1: '123 Main St', city: 'Boston', state: 'MA', zipCode: '02101', country: 'US', isDefault: true },
    shippingMethod:  { id: 'std', name: 'Standard Shipping', price: 4.99 },
    paymentSummary:  { last4: '4242', brand: 'Visa' },
    subtotal: 32.98, discount: 0, tax: 3.30, total: 41.27,
    status: 'delivered',
    placedAt: '2024-03-10T14:22:00Z',
    updatedAt: '2024-03-17T10:00:00Z',
  },
  {
    id: 'ORD-002',
    userId: 'u-shopper',
    items: [{ bookId: 'book-3', title: 'Sapiens', coverUrl: '', price: 14.99, quantity: 2, format: 'paperback' }],
    shippingAddress: { id: 'addr-1', label: 'Home', fullName: 'Jane Reader', street1: '123 Main St', city: 'Boston', state: 'MA', zipCode: '02101', country: 'US', isDefault: true },
    shippingMethod:  { id: 'exp', name: 'Express Shipping', price: 9.99 },
    paymentSummary:  { last4: '4242', brand: 'Visa' },
    subtotal: 29.98, discount: 0, tax: 3.00, total: 42.97,
    status: 'shipped',
    placedAt: '2024-06-05T09:00:00Z',
    updatedAt: '2024-06-07T12:00:00Z',
  },
];

const MOCK_ADDRESSES: Address[] = [
  { id: 'addr-1', label: 'Home', fullName: 'Jane Reader', street1: '123 Main St', city: 'Boston', state: 'MA', zipCode: '02101', country: 'US', isDefault: true },
  { id: 'addr-2', label: 'Work', fullName: 'Jane Reader', street1: '456 Office Ave', city: 'Cambridge', state: 'MA', zipCode: '02139', country: 'US', isDefault: false },
];

@Injectable({ providedIn: 'root' })
export class AccountService {
  getProfile(): Observable<User> {
    return of(MOCK_USER);
  }

  updateProfile(dto: Partial<User>): Observable<User> {
    return of({ ...MOCK_USER, ...dto });
  }

  getOrders(page: number, pageSize: number): Observable<PagedResult<Order>> {
    const start = (page - 1) * pageSize;
    return of({
      data: MOCK_ORDERS.slice(start, start + pageSize),
      meta: { page, pageSize, totalItems: MOCK_ORDERS.length, totalPages: Math.ceil(MOCK_ORDERS.length / pageSize) },
    });
  }

  getOrderDetail(orderId: string): Observable<Order | null> {
    return of(MOCK_ORDERS.find(o => o.id === orderId) ?? null);
  }

  getWishlist(): Observable<BookSummary[]> {
    return of(MOCK_FEATURED_BOOKS.slice(0, 4));
  }

  addToWishlist(_bookId: string): Observable<void> { return of(undefined); }
  removeFromWishlist(_bookId: string): Observable<void> { return of(undefined); }

  getAddresses(): Observable<Address[]> { return of(MOCK_ADDRESSES); }
  addAddress(payload: AddressPayload): Observable<Address> {
    return of({ ...payload, id: `addr-${Date.now()}` });
  }
  updateAddress(id: string, payload: AddressPayload): Observable<Address> {
    return of({ ...payload, id });
  }
  deleteAddress(_id: string): Observable<void> { return of(undefined); }
  setDefaultAddress(_id: string): Observable<void> { return of(undefined); }
  changePassword(_cur: string, _next: string): Observable<void> { return of(undefined); }
}
