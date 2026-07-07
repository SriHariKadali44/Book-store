import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService, InventoryItem } from '../../services/admin.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <h1 class="h5 fw-bold mb-3" style="color:var(--text-heading)">Inventory</h1>
    <p class="text-muted small mb-3">Books with fewer than 5 units are highlighted.</p>

    <div class="table-responsive">
      <table class="table table-hover align-middle" style="font-size:0.9rem">
        <thead>
          <tr class="text-muted border-bottom">
            <th>Book</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (item of inventory(); track item.bookId) {
            <tr [class.table-warning]="item.stock < 5">
              <td class="fw-medium">
                {{ item.title }}
                @if (item.stock === 0) {
                  <span class="badge small ms-2" style="background:var(--status-error-bg);color:var(--status-error-text)">
                    Out of stock
                  </span>
                } @else if (item.stock < 5) {
                  <span class="badge small ms-2" style="background:var(--status-warning-bg);color:var(--status-warning-text)">
                    Low stock
                  </span>
                }
              </td>
              <td>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  style="width:80px"
                  [ngModel]="item.stock"
                  (ngModelChange)="pendingEdits.set(item.bookId, $event)"
                  min="0"
                  [attr.aria-label]="'Stock for ' + item.title"
                />
              </td>
              <td>
                <button type="button" class="btn btn-sm btn-outline-primary"
                  (click)="onSave(item.bookId)">
                  Save
                </button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class AdminInventoryComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);

  readonly inventory  = signal<InventoryItem[]>([]);
  readonly pendingEdits = new Map<string, number>();

  ngOnInit(): void {
    this.adminService.getInventory().subscribe(inv => this.inventory.set(inv));
  }

  onSave(bookId: string): void {
    const stock = this.pendingEdits.get(bookId);
    if (stock === undefined) return;
    this.adminService.updateInventoryStock(bookId, stock).subscribe(() => {
      this.inventory.update(inv => inv.map(i => i.bookId === bookId ? { ...i, stock } : i));
      this.pendingEdits.delete(bookId);
      this.toastService.show('Stock updated.', 'success');
    });
  }
}
