import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { Address } from '../../../../shared/models/address.model';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN',
  'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV',
  'NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN',
  'TX','UT','VT','VA','WA','WV','WI','WY',
];

@Component({
  selector: 'app-checkout-address',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="h6 fw-bold mb-4" style="color:var(--text-heading)">Shipping Address</h2>
    <form [formGroup]="form" (ngSubmit)="onNext()">
      <div class="row g-3">
        <div class="col-12">
          <label class="form-label small fw-semibold" for="fullName">Full Name</label>
          <input id="fullName" type="text" class="form-control" formControlName="fullName"
            [class.is-invalid]="f['fullName'].invalid && f['fullName'].touched" />
          <div class="invalid-feedback">Full name is required.</div>
        </div>
        <div class="col-12">
          <label class="form-label small fw-semibold" for="street1">Street Address</label>
          <input id="street1" type="text" class="form-control" formControlName="street1"
            [class.is-invalid]="f['street1'].invalid && f['street1'].touched" />
          <div class="invalid-feedback">Street address is required.</div>
        </div>
        <div class="col-12">
          <label class="form-label small fw-semibold" for="street2">Apartment, Suite (optional)</label>
          <input id="street2" type="text" class="form-control" formControlName="street2" />
        </div>
        <div class="col-12 col-sm-6">
          <label class="form-label small fw-semibold" for="city">City</label>
          <input id="city" type="text" class="form-control" formControlName="city"
            [class.is-invalid]="f['city'].invalid && f['city'].touched" />
          <div class="invalid-feedback">City is required.</div>
        </div>
        <div class="col-6 col-sm-3">
          <label class="form-label small fw-semibold" for="state">State</label>
          <select id="state" class="form-select" formControlName="state"
            [class.is-invalid]="f['state'].invalid && f['state'].touched">
            <option value="">—</option>
            @for (s of states; track s) { <option [value]="s">{{ s }}</option> }
          </select>
          <div class="invalid-feedback">State is required.</div>
        </div>
        <div class="col-6 col-sm-3">
          <label class="form-label small fw-semibold" for="zip">ZIP Code</label>
          <input id="zip" type="text" class="form-control" formControlName="zipCode"
            [class.is-invalid]="f['zipCode'].invalid && f['zipCode'].touched" />
          <div class="invalid-feedback">ZIP code is required.</div>
        </div>
        <div class="col-12">
          <label class="form-label small fw-semibold" for="country">Country</label>
          <select id="country" class="form-select" formControlName="country">
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
          </select>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <button type="submit" class="btn btn-primary px-5"
          style="background:var(--brand-primary);border-color:var(--brand-primary)">
          Continue to Shipping
          <span class="material-icons align-middle ms-1" style="font-size:18px">arrow_forward</span>
        </button>
      </div>
    </form>
  `,
})
export class CheckoutAddressComponent {
  private readonly fb              = inject(FormBuilder);
  private readonly checkoutService = inject(CheckoutService);
  private readonly router          = inject(Router);

  readonly states = US_STATES;

  readonly form = this.fb.group({
    fullName: this.fb.nonNullable.control('', Validators.required),
    street1:  this.fb.nonNullable.control('', Validators.required),
    street2:  this.fb.nonNullable.control(''),
    city:     this.fb.nonNullable.control('', Validators.required),
    state:    this.fb.nonNullable.control('', Validators.required),
    zipCode:  this.fb.nonNullable.control('', Validators.required),
    country:  this.fb.nonNullable.control('US'),
  });

  get f() { return this.form.controls; }

  onNext(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const address: Address = { id: `addr-${Date.now()}`, label: 'Shipping', isDefault: false, ...v };
    this.checkoutService.setAddress(address);
    this.router.navigate(['/checkout/shipping']);
  }
}
