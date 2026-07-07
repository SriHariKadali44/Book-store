import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Address, AddressPayload } from '../../../../shared/models/address.model';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-address-book',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ConfirmDialogComponent],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2 class="h6 fw-bold mb-0" style="color:var(--text-heading)">Saved Addresses</h2>
      <button type="button" class="btn btn-sm btn-outline-primary" (click)="showForm.set(true)">
        <span class="material-icons align-middle me-1" style="font-size:16px">add</span>
        Add Address
      </button>
    </div>

    @if (loading()) {
      <p class="text-muted small">Loading…</p>
    }

    <div class="d-flex flex-column gap-3">
      @for (addr of addresses(); track addr.id) {
        <div class="border rounded-3 p-3 d-flex justify-content-between align-items-start gap-2">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="badge small" style="background:var(--surface-muted);color:var(--text-body)">{{ addr.label }}</span>
              @if (addr.isDefault) {
                <span class="badge small" style="background:var(--status-success-bg);color:var(--status-success-text)">Default</span>
              }
            </div>
            <p class="small text-muted mb-0">{{ addr.fullName }}</p>
            <p class="small text-muted mb-0">{{ addr.street1 }}{{ addr.street2 ? ', ' + addr.street2 : '' }}</p>
            <p class="small text-muted mb-0">{{ addr.city }}, {{ addr.state }} {{ addr.zipCode }}, {{ addr.country }}</p>
          </div>
          <div class="d-flex flex-column gap-1">
            @if (!addr.isDefault) {
              <button type="button" class="btn btn-sm btn-outline-secondary" (click)="setDefault(addr.id)">
                Set Default
              </button>
            }
            <button type="button" class="btn btn-sm btn-outline-danger border-0" (click)="confirmDelete(addr.id)"
              aria-label="Delete address">
              <span class="material-icons" style="font-size:16px">delete_outline</span>
            </button>
          </div>
        </div>
      }
    </div>

    <!-- Add form -->
    @if (showForm()) {
      <div class="border rounded-3 p-3 mt-4">
        <h3 class="h6 fw-bold mb-3" style="color:var(--text-heading)">New Address</h3>
        <form [formGroup]="form" (ngSubmit)="onAddAddress()">
          <div class="row g-2">
            <div class="col-12 col-sm-6">
              <input type="text" class="form-control form-control-sm" formControlName="fullName" placeholder="Full Name" />
            </div>
            <div class="col-12 col-sm-6">
              <input type="text" class="form-control form-control-sm" formControlName="label" placeholder="Label (e.g. Home)" />
            </div>
            <div class="col-12">
              <input type="text" class="form-control form-control-sm" formControlName="street1" placeholder="Street Address" />
            </div>
            <div class="col-8">
              <input type="text" class="form-control form-control-sm" formControlName="city" placeholder="City" />
            </div>
            <div class="col-4">
              <input type="text" class="form-control form-control-sm" formControlName="state" placeholder="State" />
            </div>
            <div class="col-6">
              <input type="text" class="form-control form-control-sm" formControlName="zipCode" placeholder="ZIP" />
            </div>
            <div class="col-6">
              <input type="text" class="form-control form-control-sm" formControlName="country" placeholder="Country" value="US" />
            </div>
          </div>
          <div class="d-flex gap-2 mt-3">
            <button type="submit" class="btn btn-sm btn-primary"
              style="background:var(--brand-primary);border-color:var(--brand-primary)">Save</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" (click)="showForm.set(false)">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (deleteId()) {
      <app-confirm-dialog
        title="Delete address?"
        message="This address will be permanently removed."
        confirmLabel="Delete"
        [destructive]="true"
        (confirmed)="onConfirmDelete()"
        (cancelled)="deleteId.set(null)"
      />
    }
  `,
})
export class AddressBookComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly toastService   = inject(ToastService);
  private readonly fb             = inject(FormBuilder);

  readonly loading   = signal(true);
  readonly addresses = signal<Address[]>([]);
  readonly showForm  = signal(false);
  readonly deleteId  = signal<string | null>(null);

  readonly form = this.fb.group({
    fullName: this.fb.nonNullable.control('', Validators.required),
    label:    this.fb.nonNullable.control('Home', Validators.required),
    street1:  this.fb.nonNullable.control('', Validators.required),
    street2:  this.fb.nonNullable.control(''),
    city:     this.fb.nonNullable.control('', Validators.required),
    state:    this.fb.nonNullable.control('', Validators.required),
    zipCode:  this.fb.nonNullable.control('', Validators.required),
    country:  this.fb.nonNullable.control('US'),
    isDefault: this.fb.nonNullable.control(false),
  });

  ngOnInit(): void {
    this.accountService.getAddresses().subscribe(a => {
      this.addresses.set(a);
      this.loading.set(false);
    });
  }

  onAddAddress(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue() as AddressPayload;
    this.accountService.addAddress(payload).subscribe(addr => {
      this.addresses.update(a => [...a, addr]);
      this.showForm.set(false);
      this.form.reset({ country: 'US', label: 'Home', isDefault: false });
      this.toastService.show('Address added.', 'success');
    });
  }

  setDefault(id: string): void {
    this.accountService.setDefaultAddress(id).subscribe(() => {
      this.addresses.update(a => a.map(addr => ({ ...addr, isDefault: addr.id === id })));
      this.toastService.show('Default address updated.', 'success');
    });
  }

  confirmDelete(id: string): void { this.deleteId.set(id); }

  onConfirmDelete(): void {
    const id = this.deleteId()!;
    this.accountService.deleteAddress(id).subscribe(() => {
      this.addresses.update(a => a.filter(addr => addr.id !== id));
      this.deleteId.set(null);
      this.toastService.show('Address deleted.', 'info');
    });
  }
}
