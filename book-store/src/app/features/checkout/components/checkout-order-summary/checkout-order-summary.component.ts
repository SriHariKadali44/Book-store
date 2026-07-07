import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { Cart } from '../../../../shared/models/cart.model';

@Component({
  selector: 'app-checkout-order-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-surface-muted rounded-3 p-4">
      <h2 class="h6 fw-bold mb-3" style="color:var(--text-heading)">Order Summary</h2>

      <div class="d-flex flex-column gap-1 mb-3">
        @for (item of cart().items; track item.bookId + item.format) {
          <div class="d-flex justify-content-between small">
            <span class="text-muted text-truncate me-2">{{ item.title }} ×{{ item.quantity }}</span>
            <span class="fw-medium flex-shrink-0">\${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        }
      </div>

      <hr class="my-2">
      <div class="d-flex justify-content-between small mb-1">
        <span class="text-muted">Subtotal</span>
        <span>\${{ cart().subtotal.toFixed(2) }}</span>
      </div>
      @if (cart().discount > 0) {
        <div class="d-flex justify-content-between small mb-1">
          <span class="text-muted">Discount</span>
          <span style="color:var(--status-success-text)">- \${{ cart().discount.toFixed(2) }}</span>
        </div>
      }
      <div class="d-flex justify-content-between small mb-1">
        <span class="text-muted">Tax</span>
        <span>\${{ cart().tax.toFixed(2) }}</span>
      </div>
      <hr class="my-2">
      <div class="d-flex justify-content-between fw-bold">
        <span>Total</span>
        <span style="color:var(--brand-primary)">\${{ cart().total.toFixed(2) }}</span>
      </div>
    </div>
  `,
})
export class CheckoutOrderSummaryComponent {
  cart = input.required<Cart>();
}
