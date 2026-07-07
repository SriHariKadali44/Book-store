import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../../shared/auth/auth.service';
import { authGuard } from './auth.guard';
import { MOCK_PASSWORD, MOCK_SHOPPER } from '../../shared/auth/auth.service.mock';

function mockState(url: string): RouterStateSnapshot {
  return { url } as RouterStateSnapshot;
}

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow access when authenticated', done => {
    authService.login(MOCK_SHOPPER.email, MOCK_PASSWORD).subscribe(() => {
      const result = TestBed.runInInjectionContext(() =>
        authGuard({} as ActivatedRouteSnapshot, mockState('/account/profile'))
      );
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect to /auth/login when unauthenticated', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, mockState('/account/orders'))
    );
    const urlTree = result as ReturnType<typeof router.createUrlTree>;
    expect(router.serializeUrl(urlTree)).toContain('/auth/login');
  });

  it('should preserve returnUrl in query params', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, mockState('/checkout/address'))
    );
    const urlTree = result as ReturnType<typeof router.createUrlTree>;
    expect(router.serializeUrl(urlTree)).toContain('returnUrl');
  });
});
