import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '../../utils/currency.pipe';

/**
 * Displays a formatted price. When `discountPrice` is provided, the original
 * `price` is shown with a strikethrough and the discount is shown in the accent colour.
 */
@Component({
  selector: 'app-price-display',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    @if (hasDiscount()) {
      <span class="d-inline-flex align-items-baseline gap-2">
        <span class="fw-bold text-accent fs-5">{{ discountPrice() | appCurrency:currency() }}</span>
        <span class="text-decoration-line-through text-muted small">{{ price() | appCurrency:currency() }}</span>
      </span>
    } @else {
      <span class="fw-bold fs-5">{{ price() | appCurrency:currency() }}</span>
    }
  `,
})
export class PriceDisplayComponent {
  price = input.required<number>();
  discountPrice = input<number | undefined>(undefined);
  currency = input<string>('USD');

  readonly hasDiscount = computed(
    () => this.discountPrice() != null && (this.discountPrice() as number) < this.price()
  );
}
