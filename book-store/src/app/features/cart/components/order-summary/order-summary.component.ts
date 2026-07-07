import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cart } from '../../../../shared/models/cart.model';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="bg-surface-muted rounded-3 p-4">
      <h2 class="h6 fw-bold mb-3" style="color:var(--text-heading)">Order Summary</h2>

      <div class="d-flex flex-column gap-2">
        <div class="d-flex justify-content-between small">
          <span class="text-muted">Subtotal</span>
          <span class="fw-medium">\${{ cart().subtotal.toFixed(2) }}</span>
        </div>
        @if (cart().discount > 0) {
          <div class="d-flex justify-content-between small">
            <span class="text-muted">Discount</span>
            <span class="fw-medium" style="color:var(--status-success-text)">
              − \${{ cart().discount.toFixed(2) }}
            </span>
          </div>
        }
        <div class="d-flex justify-content-between small">
          <span class="text-muted">Tax (10%)</span>
          <span class="fw-medium">\${{ cart().tax.toFixed(2) }}</span>
        </div>
        <hr class="my-2">
        <div class="d-flex justify-content-between fw-bold">
          <span style="color:var(--text-heading)">Total</span>
          <span style="color:var(--brand-primary);font-size:1.15rem">\${{ cart().total.toFixed(2) }}</span>
        </div>
      </div>

      <a
        routerLink="/checkout/address"
        class="btn btn-primary w-100 mt-3 fw-semibold"
        style="background:var(--brand-accent);border-color:var(--brand-accent)"
        [class.disabled]="cart().items.length === 0"
      >
        <span class="material-icons align-middle me-2" style="font-size:18px">lock</span>
        Proceed to Checkout
      </a>

      <p class="text-center text-muted mt-2 mb-0" style="font-size:0.75rem">
        <span class="material-icons align-middle me-1" style="font-size:14px">security</span>
        Secure checkout
      </p>
    </div>
  `,
})
export class OrderSummaryComponent {
  cart = input.required<Cart>();
}
