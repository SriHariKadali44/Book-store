import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User, UserRole } from '../models/user.model';
import {
  AuthResponse,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './auth.model';
import {
  MOCK_CREDENTIALS,
  MOCK_PASSWORD,
  MOCK_AUTH_RESPONSE_SHOPPER,
} from './auth.service.mock';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  // ── In-memory JWT (never persisted to localStorage) ──────────────────────
  private _accessToken: string | null = null;

  // ── Auth state signals ────────────────────────────────────────────────────
  private readonly _currentUser = signal<User | null>(null);

  readonly currentUser = this._currentUser.asReadonly();

  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  readonly userRole = computed((): UserRole | null => this._currentUser()?.role ?? null);

  // ── Token accessor (used by interceptor) ─────────────────────────────────
  getAccessToken(): string | null {
    return this._accessToken;
  }

  // ── Auth operations ───────────────────────────────────────────────────────

  login(email: string, password: string): Observable<User> {
    // --- MOCK: replace body with real HTTP call when API is ready ---
    const match = MOCK_CREDENTIALS[email];
    if (!match || password !== MOCK_PASSWORD) {
      return throwError(() => ({
        statusCode: 401,
        message: 'Invalid email or password.',
      }));
    }
    return of(match).pipe(
      tap(response => this._handleAuthResponse(response)),
      map(response => response.user)
    );
    // --- REAL (uncomment when API ready) ---
    // return this.http
    //   .post<AuthResponse>(`${this.baseUrl}/login`, { email, password })
    //   .pipe(tap(response => this._handleAuthResponse(response)), map(r => r.user));
  }

  register(dto: RegisterDto): Observable<User> {
    // --- MOCK ---
    const mockResponse = {
      ...MOCK_AUTH_RESPONSE_SHOPPER,
      user: {
        ...MOCK_AUTH_RESPONSE_SHOPPER.user,
        id: `user-${Date.now()}`,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    };
    return of(mockResponse).pipe(
      tap(response => this._handleAuthResponse(response)),
      map(response => response.user)
    );
    // --- REAL ---
    // return this.http
    //   .post<AuthResponse>(`${this.baseUrl}/register`, dto)
    //   .pipe(tap(response => this._handleAuthResponse(response)), map(r => r.user));
  }

  logout(): void {
    this._accessToken = null;
    this._currentUser.set(null);
    // --- REAL: fire-and-forget POST /auth/logout ---
    // this.http.post(`${this.baseUrl}/logout`, {}).subscribe();
  }

  refreshToken(): Observable<void> {
    // --- MOCK: treat as no-op in dev ---
    return of(undefined);
    // --- REAL ---
    // return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, {}).pipe(
    //   tap(response => this._handleAuthResponse(response)),
    //   map(() => undefined)
    // );
  }

  forgotPassword(email: string): Observable<void> {
    void email; // suppress unused warning in mock
    return of(undefined);
    // --- REAL ---
    // return this.http
    //   .post<void>(`${this.baseUrl}/forgot-password`, { email } satisfies ForgotPasswordDto);
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    void token;
    void newPassword;
    return of(undefined);
    // --- REAL ---
    // return this.http
    //   .post<void>(`${this.baseUrl}/reset-password`, { token, newPassword } satisfies ResetPasswordDto);
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private _handleAuthResponse(response: AuthResponse): void {
    this._accessToken = response.accessToken;
    this._currentUser.set(response.user);
  }
}
