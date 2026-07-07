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
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/auth/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

const passwordMatchValidator: ValidatorFn = (group: AbstractControl) => {
  const pw  = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw === cpw ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-surface-muted py-5 px-3">
      <div class="w-100" style="max-width:440px">
        <div class="text-center mb-4">
          <span class="material-icons" style="font-size:40px;color:var(--brand-primary)">menu_book</span>
          <h1 class="font-heading fw-bold mt-2 mb-1" style="font-size:1.6rem;color:var(--text-heading)">Create Account</h1>
          <p class="text-muted small">Join thousands of readers today</p>
        </div>

        <div class="bg-surface-card rounded-3 shadow-sm p-4">
          <!-- Error banner -->
          @if (serverError()) {
            <div class="alert alert-danger alert-sm py-2 small" role="alert">{{ serverError() }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="row g-3">
              <div class="col-6">
                <label class="form-label small fw-semibold" for="firstName">First Name</label>
                <input id="firstName" type="text" class="form-control" formControlName="firstName"
                  [class.is-invalid]="f['firstName'].invalid && f['firstName'].touched" />
                <div class="invalid-feedback">Required.</div>
              </div>
              <div class="col-6">
                <label class="form-label small fw-semibold" for="lastName">Last Name</label>
                <input id="lastName" type="text" class="form-control" formControlName="lastName"
                  [class.is-invalid]="f['lastName'].invalid && f['lastName'].touched" />
                <div class="invalid-feedback">Required.</div>
              </div>
              <div class="col-12">
                <label class="form-label small fw-semibold" for="email">Email Address</label>
                <input id="email" type="email" class="form-control" formControlName="email"
                  [class.is-invalid]="f['email'].invalid && f['email'].touched" />
                <div class="invalid-feedback">Enter a valid email.</div>
              </div>
              <div class="col-12">
                <label class="form-label small fw-semibold" for="password">Password</label>
                <input id="password" type="password" class="form-control" formControlName="password"
                  [class.is-invalid]="f['password'].invalid && f['password'].touched" />
                <div class="invalid-feedback">Password must be at least 8 characters.</div>
              </div>
              <div class="col-12">
                <label class="form-label small fw-semibold" for="confirm">Confirm Password</label>
                <input id="confirm" type="password" class="form-control" formControlName="confirmPassword"
                  [class.is-invalid]="(f['confirmPassword'].invalid && f['confirmPassword'].touched) || (form.errors?.['passwordMismatch'] && f['confirmPassword'].touched)" />
                @if (form.errors?.['passwordMismatch'] && f['confirmPassword'].touched) {
                  <div class="invalid-feedback d-block">Passwords do not match.</div>
                }
              </div>
              <div class="col-12">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="terms" formControlName="terms"
                    [class.is-invalid]="f['terms'].invalid && f['terms'].touched" />
                  <label class="form-check-label small" for="terms">
                    I agree to the <a href="#" style="color:var(--brand-primary)">Terms of Service</a>
                  </label>
                  <div class="invalid-feedback">You must agree to continue.</div>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 mt-3 fw-semibold"
              style="background:var(--brand-accent);border-color:var(--brand-accent)"
              [disabled]="loading()">
              {{ loading() ? 'Creating account…' : 'Create Account' }}
            </button>
          </form>

          <p class="text-center text-muted small mt-3 mb-0">
            Already have an account?
            <a routerLink="/auth/login" style="color:var(--brand-primary)">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly fb           = inject(FormBuilder);
  private readonly authService  = inject(AuthService);
  private readonly router       = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly loading     = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly form = this.fb.group({
    firstName:       this.fb.nonNullable.control('', Validators.required),
    lastName:        this.fb.nonNullable.control('', Validators.required),
    email:           this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password:        this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: this.fb.nonNullable.control('', Validators.required),
    terms:           this.fb.nonNullable.control(false, Validators.requiredTrue),
  }, { validators: passwordMatchValidator });

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.serverError.set(null);
    const { firstName, lastName, email, password } = this.form.getRawValue();
    this.authService.register({ firstName, lastName, email, password }).subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/']); },
      error: (err) => { this.loading.set(false); this.serverError.set(err?.message ?? 'Registration failed.'); },
    });
  }
}
