import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/auth/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

const passwordMatchValidator: ValidatorFn = (group: AbstractControl) => {
  const pw  = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw === cpw ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-reset-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-surface-muted py-5 px-3">
      <div class="w-100" style="max-width:420px">
        <div class="text-center mb-4">
          <h1 class="font-heading fw-bold" style="font-size:1.6rem;color:var(--text-heading)">Set New Password</h1>
        </div>
        <div class="bg-surface-card rounded-3 shadow-sm p-4">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label small fw-semibold" for="pw">New Password</label>
              <input id="pw" type="password" class="form-control" formControlName="password"
                [class.is-invalid]="f['password'].invalid && f['password'].touched" />
              <div class="invalid-feedback">Min 8 characters.</div>
            </div>
            <div class="mb-3">
              <label class="form-label small fw-semibold" for="cpw">Confirm Password</label>
              <input id="cpw" type="password" class="form-control" formControlName="confirmPassword"
                [class.is-invalid]="(form.errors?.['passwordMismatch']) && f['confirmPassword'].touched" />
              @if (form.errors?.['passwordMismatch'] && f['confirmPassword'].touched) {
                <div class="invalid-feedback d-block">Passwords do not match.</div>
              }
            </div>
            <button type="submit" class="btn btn-primary w-100" [disabled]="loading()"
              style="background:var(--brand-primary);border-color:var(--brand-primary)">
              {{ loading() ? 'Resetting…' : 'Reset Password' }}
            </button>
          </form>
          <p class="text-center small mt-3 mb-0">
            <a routerLink="/auth/login" style="color:var(--brand-primary)">Back to Sign In</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent {
  private readonly fb           = inject(FormBuilder);
  private readonly authService  = inject(AuthService);
  private readonly router       = inject(Router);
  private readonly route        = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);

  readonly loading = signal(false);

  readonly form = this.fb.group({
    password:        this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: this.fb.nonNullable.control('', Validators.required),
  }, { validators: passwordMatchValidator });

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const token    = this.route.snapshot.queryParamMap.get('token') ?? '';
    const password = this.form.getRawValue().password;
    this.authService.resetPassword(token, password).subscribe(() => {
      this.loading.set(false);
      this.toastService.show('Password reset successfully. Please sign in.', 'success');
      this.router.navigate(['/auth/login']);
    });
  }
}
