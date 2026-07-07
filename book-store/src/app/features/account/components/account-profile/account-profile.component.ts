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
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-account-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="h6 fw-bold mb-4" style="color:var(--text-heading)">Profile Information</h2>

    @if (loading()) {
      <p class="text-muted small">Loading…</p>
    } @else {
      <form [formGroup]="form" (ngSubmit)="onSave()">
        <div class="row g-3">
          <div class="col-12 col-sm-6">
            <label class="form-label small fw-semibold" for="fn">First Name</label>
            <input id="fn" type="text" class="form-control" formControlName="firstName"
              [class.is-invalid]="f['firstName'].invalid && f['firstName'].touched" />
            <div class="invalid-feedback">Required.</div>
          </div>
          <div class="col-12 col-sm-6">
            <label class="form-label small fw-semibold" for="ln">Last Name</label>
            <input id="ln" type="text" class="form-control" formControlName="lastName"
              [class.is-invalid]="f['lastName'].invalid && f['lastName'].touched" />
            <div class="invalid-feedback">Required.</div>
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold" for="email">Email</label>
            <input id="email" type="email" class="form-control" formControlName="email"
              [class.is-invalid]="f['email'].invalid && f['email'].touched" />
            <div class="invalid-feedback">Enter a valid email.</div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary mt-3" [disabled]="saving()"
          style="background:var(--brand-primary);border-color:var(--brand-primary)">
          {{ saving() ? 'Saving…' : 'Save Changes' }}
        </button>
      </form>

      <hr class="my-4">

      <h3 class="h6 fw-bold mb-3" style="color:var(--text-heading)">Change Password</h3>
      <form [formGroup]="pwForm" (ngSubmit)="onChangePassword()">
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label small fw-semibold" for="curPw">Current Password</label>
            <input id="curPw" type="password" class="form-control" formControlName="currentPassword" />
          </div>
          <div class="col-12 col-sm-6">
            <label class="form-label small fw-semibold" for="newPw">New Password</label>
            <input id="newPw" type="password" class="form-control" formControlName="newPassword" />
          </div>
        </div>
        <button type="submit" class="btn btn-outline-primary mt-3" [disabled]="changingPw()">
          {{ changingPw() ? 'Updating…' : 'Change Password' }}
        </button>
      </form>
    }
  `,
})
export class AccountProfileComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly toastService   = inject(ToastService);
  private readonly fb             = inject(FormBuilder);

  readonly loading    = signal(true);
  readonly saving     = signal(false);
  readonly changingPw = signal(false);

  readonly form = this.fb.group({
    firstName: this.fb.nonNullable.control('', Validators.required),
    lastName:  this.fb.nonNullable.control('', Validators.required),
    email:     this.fb.nonNullable.control('', [Validators.required, Validators.email]),
  });

  readonly pwForm = this.fb.group({
    currentPassword: this.fb.nonNullable.control('', Validators.required),
    newPassword:     this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
  });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.accountService.getProfile().subscribe(user => {
      this.form.patchValue({ firstName: user.firstName, lastName: user.lastName, email: user.email });
      this.loading.set(false);
    });
  }

  onSave(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.accountService.updateProfile(this.form.getRawValue()).subscribe(() => {
      this.saving.set(false);
      this.toastService.show('Profile updated successfully.', 'success');
    });
  }

  onChangePassword(): void {
    if (this.pwForm.invalid) return;
    this.changingPw.set(true);
    const { currentPassword, newPassword } = this.pwForm.getRawValue();
    this.accountService.changePassword(currentPassword, newPassword).subscribe(() => {
      this.changingPw.set(false);
      this.pwForm.reset();
      this.toastService.show('Password changed successfully.', 'success');
    });
  }
}
