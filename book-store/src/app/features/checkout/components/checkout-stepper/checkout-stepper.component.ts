import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { CheckoutStep } from '../../../../shared/models/checkout.model';

@Component({
  selector: 'app-checkout-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Checkout steps" class="mb-4">
      <ol class="d-flex align-items-center gap-0 list-unstyled mb-0 overflow-hidden">
        @for (step of steps; track step.num; let last = $last) {
          <li
            class="d-flex align-items-center flex-grow-1"
            [attr.aria-current]="currentStep() === step.num ? 'step' : null"
          >
            <div class="d-flex align-items-center gap-2 flex-shrink-0">
              <span
                class="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                style="width:32px;height:32px;font-size:0.85rem;transition:background 0.2s"
                [style.background]="getStepBg(step.num)"
                [style.color]="getStepColor(step.num)"
                [style.border]="getStepBorder(step.num)"
              >
                @if (step.num < currentStep()) {
                  <span class="material-icons" style="font-size:16px">check</span>
                } @else {
                  {{ step.num }}
                }
              </span>
              <span
                class="small d-none d-sm-inline fw-semibold"
                [style.color]="currentStep() === step.num ? 'var(--brand-primary)' : 'var(--text-muted)'"
              >{{ step.label }}</span>
            </div>
            @if (!last) {
              <div
                class="flex-grow-1 mx-2"
                style="height:2px;min-width:20px;border-radius:1px;transition:background 0.2s"
                [style.background]="step.num < currentStep() ? 'var(--brand-accent)' : 'var(--border-default)'"
              ></div>
            }
          </li>
        }
      </ol>
    </nav>
  `,
})
export class CheckoutStepperComponent {
  currentStep = input.required<CheckoutStep>();

  readonly steps: { num: CheckoutStep; label: string }[] = [
    { num: 1, label: 'Address'      },
    { num: 2, label: 'Shipping'     },
    { num: 3, label: 'Payment'      },
    { num: 4, label: 'Confirmation' },
  ];

  getStepBg(n: CheckoutStep): string {
    if (n < this.currentStep())    return 'var(--brand-accent)';
    if (n === this.currentStep())  return 'var(--brand-primary)';
    return 'var(--surface-card)';
  }
  getStepColor(n: CheckoutStep): string {
    return n <= this.currentStep() ? '#fff' : 'var(--text-muted)';
  }
  getStepBorder(n: CheckoutStep): string {
    return n > this.currentStep() ? '2px solid var(--border-default)' : 'none';
  }
}
