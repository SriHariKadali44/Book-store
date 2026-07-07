import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

/**
 * +/− quantity stepper with configurable min/max bounds.
 * Emits `valueChange` on each valid change.
 */
@Component({
  selector: 'app-quantity-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="d-inline-flex align-items-center border rounded" style="height:38px">
      <button
        type="button"
        class="btn btn-sm border-0 px-2 h-100"
        [disabled]="isAtMin()"
        [attr.aria-label]="'Decrease quantity'"
        (click)="decrement()"
      >
        <span class="material-icons" style="font-size:16px">remove</span>
      </button>

      <span
        class="px-2 text-center fw-semibold"
        style="min-width:32px"
        [attr.aria-label]="'Quantity: ' + value()"
        aria-live="polite"
      >{{ value() }}</span>

      <button
        type="button"
        class="btn btn-sm border-0 px-2 h-100"
        [disabled]="isAtMax()"
        [attr.aria-label]="'Increase quantity'"
        (click)="increment()"
      >
        <span class="material-icons" style="font-size:16px">add</span>
      </button>
    </div>
  `,
})
export class QuantityStepperComponent {
  value = input<number>(1);
  min   = input<number>(1);
  max   = input<number>(99);

  valueChange = output<number>();

  readonly isAtMin = computed(() => this.value() <= this.min());
  readonly isAtMax = computed(() => this.value() >= this.max());

  increment(): void {
    if (!this.isAtMax()) {
      this.valueChange.emit(this.value() + 1);
    }
  }

  decrement(): void {
    if (!this.isAtMin()) {
      this.valueChange.emit(this.value() - 1);
    }
  }
}
