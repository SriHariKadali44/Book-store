import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { Cart, CartItem, PromoCode } from '../../../shared/models/cart.model';
import { BookSummary, BookFormat } from '../../../shared/models/book.model';
import { Observable, of, throwError } from 'rxjs';

const EMPTY_CART: Cart = { items: [], subtotal: 0, discount: 0, tax: 0, total: 0 };
const STORAGE_KEY = 'bs_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _cart$ = new BehaviorSubject<Cart>(this._loadFromStorage());

  /** Reactive cart signal — components bind to this. */
  readonly cart = toSignal(this._cart$, { initialValue: EMPTY_CART });

  readonly itemCount = computed(() =>
    this.cart().items.reduce((sum, item) => sum + item.quantity, 0)
  );

  addItem(book: BookSummary, quantity = 1, format?: BookFormat): void {
    const fmt = format ?? book.format;
    const current = this._cart$.value;
    const idx = current.items.findIndex(
      i => i.bookId === book.id && i.format === fmt
    );

    let items: CartItem[];
    if (idx >= 0) {
      items = current.items.map((item, i) =>
        i === idx ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      items = [
        ...current.items,
        {
          bookId: book.id,
          title: book.title,
          coverUrl: book.coverUrl,
          price: book.discountPrice ?? book.price,
          quantity,
          format: fmt,
        },
      ];
    }
    this._update({ ...current, items });
  }

  removeItem(bookId: string, format: BookFormat): void {
    const current = this._cart$.value;
    this._update({
      ...current,
      items: current.items.filter(i => !(i.bookId === bookId && i.format === format)),
    });
  }

  updateQuantity(bookId: string, format: BookFormat, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(bookId, format);
      return;
    }
    const current = this._cart$.value;
    this._update({
      ...current,
      items: current.items.map(i =>
        i.bookId === bookId && i.format === format ? { ...i, quantity } : i
      ),
    });
  }

  applyPromoCode(code: string): Observable<PromoCode> {
    // Mock: only 'SAVE10' is valid
    if (code.toUpperCase() === 'SAVE10') {
      return of({ code, discountPercent: 10, isValid: true });
    }
    return throwError(() => ({ statusCode: 400, message: 'Invalid promo code.' }));
  }

  clearCart(): void {
    this._update(EMPTY_CART);
  }

  private _update(cart: Cart): void {
    const recalculated = this._recalculate(cart);
    this._cart$.next(recalculated);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(recalculated));
  }

  private _recalculate(cart: Cart): Cart {
    const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = parseFloat((subtotal * 0.1).toFixed(2));
    const total = parseFloat((subtotal - cart.discount + tax).toFixed(2));
    return { ...cart, subtotal: parseFloat(subtotal.toFixed(2)), tax, total };
  }

  private _loadFromStorage(): Cart {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Cart) : EMPTY_CART;
    } catch {
      return EMPTY_CART;
    }
  }
}
