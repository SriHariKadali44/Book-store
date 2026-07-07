import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../shared/auth/auth.service';

/**
 * Protects admin-only routes.
 * Redirects non-admin users to the home page.
 */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.userRole() === 'admin') {
    return true;
  }

  return router.createUrlTree(['/']);
};
