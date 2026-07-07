import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BookDetail, BookSummary } from '../../../shared/models/book.model';
import { Category } from '../../../shared/models/category.model';
import { Order, OrderStatus } from '../../../shared/models/order.model';
import { PagedResult } from '../../../shared/models/pagination.model';
import { MOCK_ALL_BOOKS } from '../../catalog/services/catalog.service.mock';
import { MOCK_CATEGORIES } from '../../home/services/home.service.mock';

export interface InventoryItem {
  bookId: string;
  title: string;
  stock: number;
}

const MOCK_INVENTORY: InventoryItem[] = MOCK_ALL_BOOKS.slice(0, 12).map((b, i) => ({
  bookId: b.id,
  title: b.title,
  stock: [0, 3, 15, 42, 8, 1, 22, 100, 5, 9, 2, 60][i] ?? 10,
}));

const MOCK_ADMIN_ORDERS: Order[] = [
  {
    id: 'ORD-A01', userId: 'u-1', items: [{ bookId: 'book-1', title: 'The Midnight Library', coverUrl: '', price: 12.99, quantity: 1, format: 'paperback' }],
    shippingAddress: { id: 'a1', label: 'Home', fullName: 'Alice K', street1: '1 Main St', city: 'NY', state: 'NY', zipCode: '10001', country: 'US', isDefault: true },
    shippingMethod: { id: 'std', name: 'Standard', price: 4.99 }, paymentSummary: { last4: '1234', brand: 'Visa' },
    subtotal: 12.99, discount: 0, tax: 1.30, total: 19.28, status: 'pending', placedAt: '2024-11-01T10:00:00Z', updatedAt: '2024-11-01T10:00:00Z',
  },
  {
    id: 'ORD-A02', userId: 'u-2', items: [{ bookId: 'book-2', title: 'Atomic Habits', coverUrl: '', price: 19.99, quantity: 2, format: 'hardcover' }],
    shippingAddress: { id: 'a2', label: 'Work', fullName: 'Bob M', street1: '5 Office Rd', city: 'Chicago', state: 'IL', zipCode: '60601', country: 'US', isDefault: false },
    shippingMethod: { id: 'exp', name: 'Express', price: 9.99 }, paymentSummary: { last4: '9876', brand: 'Mastercard' },
    subtotal: 39.98, discount: 0, tax: 4.00, total: 53.97, status: 'shipped', placedAt: '2024-11-05T14:00:00Z', updatedAt: '2024-11-07T08:00:00Z',
  },
];

@Injectable({ providedIn: 'root' })
export class AdminService {
  private _books    = [...MOCK_ALL_BOOKS];
  private _cats     = [...MOCK_CATEGORIES];
  private _orders   = [...MOCK_ADMIN_ORDERS];
  private _inventory = [...MOCK_INVENTORY];

  getBooks(page = 1, pageSize = 20, query = ''): Observable<PagedResult<BookSummary>> {
    let books = this._books;
    if (query) books = books.filter(b => b.title.toLowerCase().includes(query.toLowerCase()));
    const data = books.slice((page - 1) * pageSize, page * pageSize);
    return of({ data, meta: { page, pageSize, totalItems: books.length, totalPages: Math.ceil(books.length / pageSize) } });
  }

  deleteBook(id: string): Observable<void> {
    this._books = this._books.filter(b => b.id !== id);
    return of(undefined);
  }

  getCategories(): Observable<Category[]> { return of(this._cats); }
  createCategory(dto: Partial<Category>): Observable<Category> {
    const cat: Category = { id: `cat-new-${Date.now()}`, name: dto.name ?? '', slug: (dto.name ?? '').toLowerCase().replace(/\s+/g, '-'), iconName: 'menu_book', bookCount: 0 };
    this._cats = [...this._cats, cat];
    return of(cat);
  }
  deleteCategory(id: string): Observable<void> { this._cats = this._cats.filter(c => c.id !== id); return of(undefined); }

  getOrders(page = 1, pageSize = 20): Observable<PagedResult<Order>> {
    const data = this._orders.slice((page - 1) * pageSize, page * pageSize);
    return of({ data, meta: { page, pageSize, totalItems: this._orders.length, totalPages: Math.ceil(this._orders.length / pageSize) } });
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order> {
    const order = this._orders.find(o => o.id === orderId);
    if (order) order.status = status;
    return of(order!);
  }

  getInventory(): Observable<InventoryItem[]> { return of(this._inventory); }
  updateInventoryStock(bookId: string, stock: number): Observable<void> {
    const item = this._inventory.find(i => i.bookId === bookId);
    if (item) item.stock = stock;
    return of(undefined);
  }
}
