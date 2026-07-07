import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { AuthService } from '../../shared/auth/auth.service';

/**
 * Functional interceptor that attaches the in-memory JWT access token
 * to every outgoing HTTP request as a Bearer Authorization header.
 *
 * Skips the header when no token is present (unauthenticated requests).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq);
};
