import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { BookFormat } from '../../../../shared/models/book.model';
import { CartItem } from '../../../../shared/models/cart.model';
import { QuantityStepperComponent } from '../../../../shared/ui/quantity-stepper/quantity-stepper.component';
import { PriceDisplayComponent } from '../../../../shared/ui/price-display/price-display.component';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-line-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuantityStepperComponent, PriceDisplayComponent, ConfirmDialogComponent, BadgeComponent, CurrencyPipe],
  template: `
    <div class="d-flex gap-3 py-3 border-bottom align-items-start">
      <div
        class="bg-surface-muted rounded d-flex align-items-center justify-content-center flex-shrink-0"
        style="width:80px;height:100px;border:1px solid var(--border-default)"
      >
        <span class="material-icons text-muted" style="font-size:40px">menu_book</span>
      </div>

      <div class="flex-grow-1 min-w-0">
        <h3 class="h6 fw-semibold mb-1 text-truncate" style="color:var(--text-heading)">{{ item().title }}</h3>
        <div class="mb-2">
          <app-badge [label]="item().format" variant="format" />
        </div>
        <div class="d-flex flex-wrap align-items-center gap-3">
          <app-quantity-stepper
            [value]="item().quantity"
            [min]="1"
            [max]="99"
            (valueChange)="quantityChange.emit({ bookId: item().bookId, format: item().format, qty: $event })"
          />
          <app-price-display [price]="item().price" />
        </div>
      </div>

      <div class="d-flex flex-column align-items-end gap-2 flex-shrink-0">
        <span class="fw-bold" style="color:var(--text-heading)">
          {{ lineTotal() | currency:'USD' }}
        </span>
        <button
          type="button"
          class="btn btn-sm btn-outline-danger border-0 p-1"
          aria-label="Remove from cart"
          (click)="showConfirm.set(true)"
        >
          <span class="material-icons" style="font-size:20px">delete_outline</span>
        </button>
      </div>
    </div>

    @if (showConfirm()) {
      <app-confirm-dialog
        title="Remove item?"
        [message]="removeMsg()"
        confirmLabel="Remove"
        [destructive]="true"
        (confirmed)="onConfirmRemove()"
        (cancelled)="showConfirm.set(false)"
      />
    }
  `,
})
export class CartLineItemComponent {
  item = input.required<CartItem>();

  quantityChange = output<{ bookId: string; format: BookFormat; qty: number }>();
  removeItem     = output<{ bookId: string; format: BookFormat }>();

  readonly showConfirm = signal(false);
  readonly lineTotal   = computed(() => this.item().price * this.item().quantity);
  readonly removeMsg   = computed(() => `Remove "${this.item().title}" from your cart?`);

  onConfirmRemove(): void {
    this.removeItem.emit({ bookId: this.item().bookId, format: this.item().format });
    this.showConfirm.set(false);
  }
}
