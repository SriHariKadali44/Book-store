import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../shared/auth/auth.service';

/**
 * Protects routes that require an authenticated user.
 * Redirects unauthenticated visitors to /auth/login,
 * preserving the attempted URL so login can redirect back.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });
};
