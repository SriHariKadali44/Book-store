import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { ShippingMethod } from '../../../../shared/models/checkout.model';

@Component({
  selector: 'app-checkout-shipping',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h2 class="h6 fw-bold mb-4" style="color:var(--text-heading)">Shipping Method</h2>

    @if (loading()) {
      <p class="text-muted small">Loading shipping options…</p>
    } @else {
      <form [formGroup]="form" (ngSubmit)="onNext()">
        <div class="d-flex flex-column gap-2">
          @for (method of methods(); track method.id) {
            <label
              class="d-flex align-items-start gap-3 p-3 rounded-3 border cursor-pointer"
              [style.border-color]="form.controls.methodId.value === method.id ? 'var(--brand-primary)' : 'var(--border-default)'"
              [style.background]="form.controls.methodId.value === method.id ? 'var(--surface-muted)' : 'var(--surface-card)'"
              style="cursor:pointer;transition:border-color 0.15s,background 0.15s"
            >
              <input type="radio" class="form-check-input mt-1 flex-shrink-0" formControlName="methodId" [value]="method.id" />
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between">
                  <span class="fw-semibold small">{{ method.name }}</span>
                  <span class="fw-bold small" style="color:var(--brand-primary)">
                    {{ method.price === 0 ? 'FREE' : '$' + method.price.toFixed(2) }}
                  </span>
                </div>
                <p class="text-muted mb-0" style="font-size:0.8rem">{{ method.description }}</p>
              </div>
            </label>
          }
        </div>

        <div class="d-flex justify-content-between mt-4">
          <a routerLink="/checkout/address" class="btn btn-outline-secondary">
            <span class="material-icons align-middle me-1" style="font-size:16px">arrow_back</span>
            Back
          </a>
          <button type="submit" class="btn btn-primary px-5"
            style="background:var(--brand-primary);border-color:var(--brand-primary)">
            Continue to Payment
            <span class="material-icons align-middle ms-1" style="font-size:18px">arrow_forward</span>
          </button>
        </div>
      </form>
    }
  `,
})
export class CheckoutShippingComponent implements OnInit {
  private readonly checkoutService = inject(CheckoutService);
  private readonly router          = inject(Router);
  private readonly fb              = inject(FormBuilder);

  readonly methods = signal<ShippingMethod[]>([]);
  readonly loading = signal(true);

  readonly form = this.fb.group({
    methodId: this.fb.nonNullable.control('', Validators.required),
  });

  ngOnInit(): void {
    this.checkoutService.getShippingMethods().subscribe(methods => {
      this.methods.set(methods);
      this.loading.set(false);
      if (methods.length) this.form.controls.methodId.setValue(methods[0].id);
    });
  }

  onNext(): void {
    if (this.form.invalid) return;
    const selected = this.methods().find(m => m.id === this.form.getRawValue().methodId)!;
    this.checkoutService.setShippingMethod(selected);
    this.router.navigate(['/checkout/payment']);
  }
}
