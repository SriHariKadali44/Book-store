import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/auth/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-surface-muted py-5 px-3">
      <div class="w-100" style="max-width:420px">
        <div class="text-center mb-4">
          <span class="material-icons" style="font-size:40px;color:var(--brand-primary)">menu_book</span>
          <h1 class="font-heading fw-bold mt-2 mb-1" style="font-size:1.6rem;color:var(--text-heading)">Sign In</h1>
          <p class="text-muted small">Welcome back to BookStore</p>
        </div>

        <div class="bg-surface-card rounded-3 shadow-sm p-4">
          <!-- Demo credentials hint -->
          <div class="alert alert-light border small py-2 mb-3">
            <strong>Demo:</strong> alice@example.com / admin@bookstore.com — password: <code>password123</code>
          </div>

          @if (serverError()) {
            <div class="alert alert-danger py-2 small" role="alert">{{ serverError() }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label small fw-semibold" for="email">Email Address</label>
              <input id="email" type="email" class="form-control" formControlName="email"
                autocomplete="email"
                [class.is-invalid]="f['email'].invalid && f['email'].touched" />
              <div class="invalid-feedback">Enter a valid email.</div>
            </div>
            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <label class="form-label small fw-semibold mb-0" for="password">Password</label>
                <a routerLink="/auth/forgot-password" class="small" style="color:var(--brand-primary)">Forgot password?</a>
              </div>
              <input id="password" type="password" class="form-control" formControlName="password"
                autocomplete="current-password"
                [class.is-invalid]="f['password'].invalid && f['password'].touched" />
              <div class="invalid-feedback">Password is required.</div>
            </div>
            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" id="remember" formControlName="remember" />
              <label class="form-check-label small" for="remember">Remember me</label>
            </div>

            <button type="submit" class="btn btn-primary w-100 fw-semibold"
              style="background:var(--brand-accent);border-color:var(--brand-accent)"
              [disabled]="loading()">
              {{ loading() ? 'Signing in…' : 'Sign In' }}
            </button>
          </form>

          <p class="text-center text-muted small mt-3 mb-0">
            Don't have an account?
            <a routerLink="/auth/register" style="color:var(--brand-primary)">Create one</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb           = inject(FormBuilder);
  private readonly authService  = inject(AuthService);
  private readonly router       = inject(Router);
  private readonly route        = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);

  readonly loading     = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly form = this.fb.group({
    email:    this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', Validators.required),
    remember: this.fb.nonNullable.control(false),
  });

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.serverError.set(null);
    const { email, password } = this.form.getRawValue();
    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.loading.set(false);
        this.toastService.show(`Welcome back, ${user.firstName}!`, 'success');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading.set(false);
        this.serverError.set(err?.message ?? 'Invalid email or password.');
      },
    });
  }
}
