import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { Order } from '../../../../shared/models/order.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SlicePipe, BadgeComponent],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2 class="h6 fw-bold mb-0" style="color:var(--text-heading)">Order Details</h2>
      <a routerLink="/account/orders" class="btn btn-sm btn-outline-secondary">
        <span class="material-icons align-middle me-1" style="font-size:14px">arrow_back</span>
        All Orders
      </a>
    </div>

    @if (loading()) {
      <p class="text-muted small">Loading…</p>
    } @else if (!order()) {
      <p class="text-muted small">Order not found.</p>
    } @else {
      <div class="mb-3 d-flex flex-wrap justify-content-between gap-2">
        <div>
          <span class="text-muted small">Order ID: </span>
          <strong class="font-monospace small">{{ order()!.id }}</strong>
        </div>
        <div>
          <span class="text-muted small">Placed: </span>
          <span class="small">{{ order()!.placedAt | slice:0:10 }}</span>
        </div>
        <app-badge [label]="order()!.status" variant="status" />
      </div>

      <!-- Items -->
      <div class="border rounded-3 overflow-hidden mb-3">
        @for (item of order()!.items; track item.bookId) {
          <div class="d-flex align-items-center justify-content-between gap-3 p-3 border-bottom">
            <div class="d-flex align-items-center gap-3">
              <div class="bg-surface-muted rounded" style="width:48px;height:60px;flex-shrink:0;display:flex;align-items:center;justify-content:center">
                <span class="material-icons text-muted" style="font-size:24px">menu_book</span>
              </div>
              <div>
                <p class="fw-semibold small mb-0">{{ item.title }}</p>
                <p class="text-muted mb-0" style="font-size:0.8rem">Qty: {{ item.quantity }} · {{ item.format }}</p>
              </div>
            </div>
            <span class="fw-medium small">\${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        }
      </div>

      <!-- Summary -->
      <div class="row g-3">
        <div class="col-12 col-sm-6">
          <h3 class="small fw-bold mb-2" style="color:var(--text-heading)">Shipping To</h3>
          <address class="small text-muted" style="font-style:normal">
            {{ order()!.shippingAddress.fullName }}<br>
            {{ order()!.shippingAddress.street1 }}<br>
            {{ order()!.shippingAddress.city }}, {{ order()!.shippingAddress.state }} {{ order()!.shippingAddress.zipCode }}
          </address>
        </div>
        <div class="col-12 col-sm-6">
          <h3 class="small fw-bold mb-2" style="color:var(--text-heading)">Payment</h3>
          <p class="small text-muted mb-0">
            {{ order()!.paymentSummary.brand }} ending in {{ order()!.paymentSummary.last4 }}
          </p>
          <p class="small text-muted mb-0">{{ order()!.shippingMethod.name }}</p>
        </div>
        <div class="col-12">
          <div class="d-flex justify-content-between fw-bold pt-2 border-top">
            <span>Total</span>
            <span style="color:var(--brand-primary)">\${{ order()!.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    }
  `,
})
export class OrderDetailComponent implements OnInit {
  id = input<string>('');
  private readonly accountService = inject(AccountService);

  readonly loading = signal(true);
  readonly order   = signal<Order | null>(null);

  ngOnInit(): void {
    this.accountService.getOrderDetail(this.id()).subscribe(o => {
      this.order.set(o);
      this.loading.set(false);
    });
  }
}
