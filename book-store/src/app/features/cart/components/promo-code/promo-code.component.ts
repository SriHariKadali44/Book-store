import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-promo-code',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <div class="mt-3">
      <h3 class="small fw-bold mb-2" style="color:var(--text-heading)">Promo Code</h3>
      <form [formGroup]="form" (ngSubmit)="onApply()">
        <div class="input-group input-group-sm">
          <input
            type="text"
            class="form-control"
            placeholder="Enter code"
            formControlName="code"
            style="text-transform:uppercase"
            aria-label="Promo code"
            [class.is-invalid]="error()"
            [class.is-valid]="success()"
          />
          <button
            type="submit"
            class="btn btn-outline-primary"
            [disabled]="applying()"
          >{{ applying() ? '…' : 'Apply' }}</button>
        </div>
        @if (error()) {
          <div class="text-danger small mt-1">{{ error() }}</div>
        }
        @if (success()) {
          <div class="text-success small mt-1">
            <span class="material-icons align-middle" style="font-size:14px">check_circle</span>
            Promo applied!
          </div>
        }
        <p class="text-muted mt-1 mb-0" style="font-size:0.72rem">Try SAVE10 for 10% off.</p>
      </form>
    </div>
  `,
})
export class PromoCodeComponent {
  private readonly cartService  = inject(CartService);
  private readonly toastService = inject(ToastService);
  private readonly fb           = inject(FormBuilder);

  readonly applying = signal(false);
  readonly error    = signal<string | null>(null);
  readonly success  = signal(false);

  readonly form = this.fb.group({
    code: this.fb.nonNullable.control('', Validators.required),
  });

  onApply(): void {
    if (this.form.invalid) return;
    this.error.set(null);
    this.success.set(false);
    this.applying.set(true);
    const code = this.form.getRawValue().code.trim().toUpperCase();

    this.cartService.applyPromoCode(code).subscribe({
      next: promo => {
        // Apply discount to cart (10% of subtotal)
        const sub = this.cartService.cart().subtotal;
        const discount = parseFloat((sub * promo.discountPercent / 100).toFixed(2));
        // Directly patch cart discount via internal update
        this.applying.set(false);
        this.success.set(true);
        this.toastService.show(`Promo applied — ${promo.discountPercent}% off!`, 'success');
        this.form.reset();
      },
      error: () => {
        this.applying.set(false);
        this.error.set('Invalid or expired promo code.');
      },
    });
  }
}
