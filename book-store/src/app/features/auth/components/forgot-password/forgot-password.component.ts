import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-surface-muted py-5 px-3">
      <div class="w-100" style="max-width:420px">
        <div class="text-center mb-4">
          <span class="material-icons" style="font-size:40px;color:var(--brand-primary)">lock_reset</span>
          <h1 class="font-heading fw-bold mt-2 mb-1" style="font-size:1.6rem;color:var(--text-heading)">Reset Password</h1>
        </div>
        <div class="bg-surface-card rounded-3 shadow-sm p-4">
          @if (!sent()) {
            <p class="text-muted small mb-3">Enter your email and we'll send a reset link.</p>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label small fw-semibold" for="email">Email Address</label>
                <input id="email" type="email" class="form-control" formControlName="email"
                  [class.is-invalid]="f['email'].invalid && f['email'].touched" />
                <div class="invalid-feedback">Enter a valid email.</div>
              </div>
              <button type="submit" class="btn btn-primary w-100" [disabled]="loading()"
                style="background:var(--brand-primary);border-color:var(--brand-primary)">
                {{ loading() ? 'Sending…' : 'Send Reset Link' }}
              </button>
            </form>
          } @else {
            <div class="text-center py-2">
              <span class="material-icons text-success" style="font-size:48px">mark_email_read</span>
              <p class="mt-2 mb-3">If that email exists, a reset link has been sent.</p>
            </div>
          }
          <p class="text-center small mt-3 mb-0">
            <a routerLink="/auth/login" style="color:var(--brand-primary)">Back to Sign In</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private readonly fb          = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly sent    = signal(false);

  readonly form = this.fb.group({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
  });

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.authService.forgotPassword(this.form.getRawValue().email).subscribe(() => {
      this.loading.set(false);
      this.sent.set(true);
    });
  }
}
