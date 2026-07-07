import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../../cart/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Order } from '../../../../shared/models/order.model';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h2 class="h6 fw-bold mb-4" style="color:var(--text-heading)">Payment Details</h2>

    <div class="alert alert-light border small mb-4">
      <span class="material-icons align-middle me-1" style="font-size:16px;color:var(--brand-accent)">info</span>
      This is a demo — no real payment is processed. Use any card details.
    </div>

    <form [formGroup]="form" (ngSubmit)="onPlaceOrder()">
      <div class="row g-3">
        <div class="col-12">
          <label class="form-label small fw-semibold" for="cardholder">Cardholder Name</label>
          <input id="cardholder" type="text" class="form-control" formControlName="cardholder"
            placeholder="Jane Smith"
            [class.is-invalid]="f['cardholder'].invalid && f['cardholder'].touched" />
          <div class="invalid-feedback">Cardholder name is required.</div>
        </div>
        <div class="col-12">
          <label class="form-label small fw-semibold" for="cardNumber">Card Number</label>
          <input id="cardNumber" type="text" class="form-control" formControlName="cardNumber"
            placeholder="4242 4242 4242 4242" maxlength="19"
            [class.is-invalid]="f['cardNumber'].invalid && f['cardNumber'].touched" />
          <div class="invalid-feedback">Enter a valid 16-digit card number.</div>
        </div>
        <div class="col-6">
          <label class="form-label small fw-semibold" for="expiry">Expiry (MM/YY)</label>
          <input id="expiry" type="text" class="form-control" formControlName="expiry"
            placeholder="12/26" maxlength="5"
            [class.is-invalid]="f['expiry'].invalid && f['expiry'].touched" />
          <div class="invalid-feedback">Enter valid expiry (MM/YY).</div>
        </div>
        <div class="col-6">
          <label class="form-label small fw-semibold" for="cvc">CVC</label>
          <input id="cvc" type="text" class="form-control" formControlName="cvc"
            placeholder="123" maxlength="4"
            [class.is-invalid]="f['cvc'].invalid && f['cvc'].touched" />
          <div class="invalid-feedback">CVC is required.</div>
        </div>
      </div>

      <div class="d-flex justify-content-between mt-4">
        <a routerLink="/checkout/shipping" class="btn btn-outline-secondary">
          <span class="material-icons align-middle me-1" style="font-size:16px">arrow_back</span>
          Back
        </a>
        <button type="submit" class="btn btn-success px-5 fw-semibold" [disabled]="placing()">
          <span class="material-icons align-middle me-2" style="font-size:18px">lock</span>
          {{ placing() ? 'Placing Order…' : 'Place Order' }}
        </button>
      </div>
    </form>
  `,
})
export class CheckoutPaymentComponent {
  private readonly fb              = inject(FormBuilder);
  private readonly checkoutService = inject(CheckoutService);
  private readonly cartService     = inject(CartService);
  private readonly toastService    = inject(ToastService);
  private readonly router          = inject(Router);

  readonly placing = signal(false);

  readonly form = this.fb.group({
    cardholder: this.fb.nonNullable.control('', Validators.required),
    cardNumber: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/)]),
    expiry:     this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]),
    cvc:        this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^\d{3,4}$/)]),
  });

  get f() { return this.form.controls; }

  onPlaceOrder(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.placing.set(true);
    const token = `tok_${Date.now()}`;
    this.checkoutService.setPaymentToken(token);
    this.checkoutService.placeOrder(this.cartService.cart()).subscribe({
      next: (order: Order) => {
        this.placing.set(false);
        this.cartService.clearCart();
        this.router.navigate(['/checkout/confirmation'], { state: { order } });
      },
      error: () => {
        this.placing.set(false);
        this.toastService.show('Failed to place order. Please try again.', 'error');
      },
    });
  }
}
