import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { Order } from '../../../../shared/models/order.model';

@Component({
  selector: 'app-checkout-confirmation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="text-center py-4">
      <!-- Success icon -->
      <div
        class="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
        style="width:80px;height:80px;background:var(--status-success-bg)"
      >
        <span class="material-icons" style="font-size:40px;color:var(--status-success-text)">check_circle</span>
      </div>

      <h1 class="font-heading fw-bold mb-2" style="color:var(--text-heading);font-size:1.75rem">
        Order Confirmed!
      </h1>
      <p class="text-muted mb-1">
        Thank you for your purchase.
      </p>

      @if (order()) {
        <p class="fw-semibold mb-4" style="color:var(--brand-primary)">
          Order ID: <span class="font-monospace">{{ order()!.id }}</span>
        </p>

        <!-- Items -->
        <div class="border rounded-3 p-3 text-start mb-4">
          <h2 class="h6 fw-bold mb-3" style="color:var(--text-heading)">Items Ordered</h2>
          @for (item of order()!.items; track item.bookId) {
            <div class="d-flex justify-content-between small py-1 border-bottom">
              <span class="text-muted text-truncate me-2">{{ item.title }} ×{{ item.quantity }}</span>
              <span class="fw-medium flex-shrink-0">\${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          }
          <div class="d-flex justify-content-between fw-bold mt-2">
            <span>Total</span>
            <span style="color:var(--brand-primary)">\${{ order()!.total.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Shipping info -->
        <div class="text-muted small mb-4">
          <p class="mb-1">
            <span class="material-icons align-middle me-1" style="font-size:14px">local_shipping</span>
            {{ order()!.shippingMethod.name }} — estimated {{ order()!.shippingMethod.price === 0 ? 'Free' : '$' + order()!.shippingMethod.price.toFixed(2) }}
          </p>
          <p class="mb-0">
            Delivering to {{ order()!.shippingAddress.city }}, {{ order()!.shippingAddress.state }}
          </p>
        </div>
      }

      <div class="d-flex justify-content-center gap-3 flex-wrap">
        <a routerLink="/" class="btn btn-outline-primary">
          <span class="material-icons align-middle me-1" style="font-size:18px">home</span>
          Continue Shopping
        </a>
        <a routerLink="/account/orders" class="btn btn-primary"
          style="background:var(--brand-primary);border-color:var(--brand-primary)">
          <span class="material-icons align-middle me-1" style="font-size:18px">receipt_long</span>
          View Orders
        </a>
      </div>
    </div>
  `,
})
export class CheckoutConfirmationComponent implements OnInit {
  private readonly router          = inject(Router);
  private readonly checkoutService = inject(CheckoutService);

  readonly order = signal<Order | null>(null);

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const order = nav?.extras?.state?.['order'] as Order | undefined;
    if (order) {
      this.order.set(order);
      this.checkoutService.resetCheckout();
    } else {
      this.router.navigate(['/']);
    }
  }
}
