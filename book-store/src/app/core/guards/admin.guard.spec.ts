import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../../shared/auth/auth.service';
import { adminGuard } from './admin.guard';
import { MOCK_PASSWORD, MOCK_SHOPPER, MOCK_ADMIN } from '../../shared/auth/auth.service.mock';

function mockState(url: string): RouterStateSnapshot {
  return { url } as RouterStateSnapshot;
}

describe('adminGuard', () => {
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

  it('should allow access for admin role', done => {
    authService.login(MOCK_ADMIN.email, MOCK_PASSWORD).subscribe(() => {
      const result = TestBed.runInInjectionContext(() =>
        adminGuard({} as ActivatedRouteSnapshot, mockState('/admin/books'))
      );
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect shopper to /', done => {
    authService.login(MOCK_SHOPPER.email, MOCK_PASSWORD).subscribe(() => {
      const result = TestBed.runInInjectionContext(() =>
        adminGuard({} as ActivatedRouteSnapshot, mockState('/admin/books'))
      );
      const urlTree = result as ReturnType<typeof router.createUrlTree>;
      expect(router.serializeUrl(urlTree)).toBe('/');
      done();
    });
  });

  it('should redirect unauthenticated user to /', () => {
    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as ActivatedRouteSnapshot, mockState('/admin'))
    );
    const urlTree = result as ReturnType<typeof router.createUrlTree>;
    expect(router.serializeUrl(urlTree)).toBe('/');
  });
});
