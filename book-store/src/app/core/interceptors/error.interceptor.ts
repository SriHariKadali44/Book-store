import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../../shared/auth/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Functional interceptor for centralised HTTP error handling:
 *
 *  401 Unauthorized — clear auth state and redirect to /auth/login
 *  403 Forbidden    — navigate to home page
 *  5xx Server Error — show a generic error toast
 *
 * All other errors are re-thrown unchanged for feature-level handling.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      switch (error.status) {
        case 401:
          auth.logout();
          router.navigate(['/auth/login']);
          break;

        case 403:
          router.navigate(['/']);
          break;

        default:
          if (error.status >= 500) {
            toast.show(
              'Something went wrong. Please try again.',
              'error'
            );
          }
          break;
      }

      return throwError(() => error);
    })
  );
};
