import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { Order } from '../../../../shared/models/order.model';
import { PagedResult } from '../../../../shared/models/pagination.model';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SlicePipe, PaginationComponent, BadgeComponent],
  template: `
    <h2 class="h6 fw-bold mb-4" style="color:var(--text-heading)">Order History</h2>

    @if (loading()) {
      <p class="text-muted small">Loading orders…</p>
    } @else if ((result()?.data?.length ?? 0) === 0) {
      <p class="text-muted small">You haven't placed any orders yet.</p>
    } @else {
      <div class="table-responsive">
        <table class="table table-hover align-middle" style="font-size:0.9rem">
          <thead>
            <tr class="text-muted small border-bottom">
              <th class="fw-semibold">Order ID</th>
              <th class="fw-semibold">Date</th>
              <th class="fw-semibold">Items</th>
              <th class="fw-semibold">Total</th>
              <th class="fw-semibold">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (order of result()?.data; track order.id) {
              <tr>
                <td class="font-monospace small" style="color:var(--brand-primary)">{{ order.id }}</td>
                <td class="text-muted">{{ order.placedAt | slice:0:10 }}</td>
                <td>{{ order.items.length }} item{{ order.items.length !== 1 ? 's' : '' }}</td>
                <td class="fw-semibold">\${{ order.total.toFixed(2) }}</td>
                <td>
                  <app-badge [label]="order.status" variant="status" />
                </td>
                <td>
                  <a [routerLink]="['/account/orders', order.id]" class="btn btn-sm btn-outline-primary">Details</a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if ((result()?.meta?.totalPages ?? 0) > 1) {
        <app-pagination [meta]="result()!.meta" (pageChange)="loadOrders($event)" />
      }
    }
  `,
})
export class OrderListComponent implements OnInit {
  private readonly accountService = inject(AccountService);

  readonly loading = signal(true);
  readonly result  = signal<PagedResult<Order> | null>(null);

  ngOnInit(): void { this.loadOrders(1); }

  loadOrders(page: number): void {
    this.loading.set(true);
    this.accountService.getOrders(page, 10).subscribe(r => {
      this.result.set(r);
      this.loading.set(false);
    });
  }
}
