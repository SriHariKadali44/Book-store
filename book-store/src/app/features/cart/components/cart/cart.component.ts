import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';

import { CartService } from '../../services/cart.service';
import { BookFormat } from '../../../../shared/models/book.model';
import { BreadcrumbComponent } from '../../../../shared/ui/breadcrumb/breadcrumb.component';
import { CartLineItemComponent } from '../cart-line-item/cart-line-item.component';
import { CartEmptyStateComponent } from '../cart-empty-state/cart-empty-state.component';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { PromoCodeComponent } from '../promo-code/promo-code.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BreadcrumbComponent,
    CartLineItemComponent,
    CartEmptyStateComponent,
    OrderSummaryComponent,
    PromoCodeComponent,
  ],
  template: `
    <div class="container-xl px-3 px-lg-4 py-4">
      <app-breadcrumb
        [crumbs]="[{ label: 'Home', route: '/' }, { label: 'Cart', route: '/cart' }]"
      />

      <h1 class="font-heading fw-bold mb-4" style="font-size:clamp(1.5rem,3vw,2rem);color:var(--text-heading)">
        Your Cart
        @if (cartService.itemCount() > 0) {
          <span class="badge rounded-pill ms-2" style="font-size:0.7em;background:var(--brand-accent)">
            {{ cartService.itemCount() }}
          </span>
        }
      </h1>

      @if (cartService.itemCount() === 0) {
        <app-cart-empty-state />
      } @else {
        <div class="row g-4">
          <!-- Line items -->
          <div class="col-12 col-lg-8">
            @for (item of cartService.cart().items; track item.bookId + item.format) {
              <app-cart-line-item
                [item]="item"
                (quantityChange)="onQuantityChange($event)"
                (removeItem)="onRemove($event)"
              />
            }
          </div>

          <!-- Summary -->
          <div class="col-12 col-lg-4">
            <app-order-summary [cart]="cartService.cart()" />
            <app-promo-code />
          </div>
        </div>
      }
    </div>
  `,
})
export class CartComponent {
  readonly cartService = inject(CartService);

  onQuantityChange(event: { bookId: string; format: BookFormat; qty: number }): void {
    this.cartService.updateQuantity(event.bookId, event.format, event.qty);
  }

  onRemove(event: { bookId: string; format: BookFormat }): void {
    this.cartService.removeItem(event.bookId, event.format);
  }
}
