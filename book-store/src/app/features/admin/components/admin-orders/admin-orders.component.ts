import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Order, OrderStatus } from '../../../../shared/models/order.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';

const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, SlicePipe],
  template: `
    <h1 class="h5 fw-bold mb-3" style="color:var(--text-heading)">Manage Orders</h1>

    <div class="table-responsive">
      <table class="table table-hover align-middle" style="font-size:0.88rem">
        <thead>
          <tr class="text-muted border-bottom">
            <th>Order ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          @for (order of orders(); track order.id) {
            <tr>
              <td class="font-monospace small" style="color:var(--brand-primary)">{{ order.id }}</td>
              <td class="text-muted">{{ order.placedAt | slice:0:10 }}</td>
              <td class="fw-semibold">\${{ order.total.toFixed(2) }}</td>
              <td>
                <app-badge [label]="order.status" variant="status" />
              </td>
              <td>
                <select class="form-select form-select-sm" style="width:auto"
                  [value]="order.status"
                  (change)="onStatusChange(order.id, $event)">
                  @for (s of statuses; track s) {
                    <option [value]="s" class="text-capitalize">{{ s }}</option>
                  }
                </select>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class AdminOrdersComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);

  readonly orders   = signal<Order[]>([]);
  readonly statuses = ORDER_STATUSES;

  ngOnInit(): void {
    this.adminService.getOrders().subscribe(r => this.orders.set(r.data));
  }

  onStatusChange(orderId: string, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as OrderStatus;
    this.adminService.updateOrderStatus(orderId, status).subscribe(updated => {
      this.orders.update(list => list.map(o => o.id === orderId ? updated : o));
      this.toastService.show(`Order ${orderId} updated to ${status}.`, 'success');
    });
  }
}
