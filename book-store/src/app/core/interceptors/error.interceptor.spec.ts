import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { errorInterceptor } from './error.interceptor';
import { AuthService } from '../../shared/auth/auth.service';
import { ToastService } from '../services/toast.service';
import { MOCK_PASSWORD, MOCK_SHOPPER } from '../../shared/auth/auth.service.mock';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let authService: AuthService;
  let router: Router;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: '**', redirectTo: '' }])],
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    toastService = TestBed.inject(ToastService);
  });

  afterEach(() => controller.verify());

  it('should pass through successful responses unchanged', done => {
    http.get('/api/books').subscribe(res => {
      expect(res).toEqual([{ id: '1' }]);
      done();
    });
    controller.expectOne('/api/books').flush([{ id: '1' }]);
  });

  it('should clear auth and redirect to /auth/login on 401', fakeAsync(() => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    // Login synchronously via mock
    let loginDone = false;
    authService.login(MOCK_SHOPPER.email, MOCK_PASSWORD).subscribe(() => {
      loginDone = true;
    });
    tick();
    expect(loginDone).toBe(true);
    expect(authService.isAuthenticated()).toBe(true);

    http.get('/api/profile').subscribe({ error: () => {} });

    controller.expectOne('/api/profile').flush(
      { message: 'Unauthorized' },
      { status: 401, statusText: 'Unauthorized' }
    );

    tick();

    expect(authService.isAuthenticated()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  }));

  it('should navigate home on 403', fakeAsync(() => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    http.get('/api/admin').subscribe({ error: () => {} });

    controller.expectOne('/api/admin').flush(
      { message: 'Forbidden' },
      { status: 403, statusText: 'Forbidden' }
    );

    tick();

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  }));

  it('should show error toast on 500', fakeAsync(() => {
    const showSpy = jest.spyOn(toastService, 'show');

    http.get('/api/books').subscribe({ error: () => {} });

    controller.expectOne('/api/books').flush(
      { message: 'Server Error' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    tick();

    expect(showSpy).toHaveBeenCalledWith(
      'Something went wrong. Please try again.',
      'error'
    );

    // Drain the toast auto-dismiss timer to avoid zone leakage
    tick(5000);
  }));

  it('should re-throw the error after handling 500', done => {
    http.get('/api/books').subscribe({
      next: () => done.fail('Expected error'),
      error: (err: unknown) => {
        expect(err).toBeInstanceOf(HttpErrorResponse);
        expect((err as HttpErrorResponse).status).toBe(500);
        done();
      },
    });

    controller.expectOne('/api/books').flush(
      { message: 'Server Error' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  });

  it('should re-throw the error after handling 401', done => {
    http.get('/api/profile').subscribe({
      next: () => done.fail('Expected error'),
      error: (err: unknown) => {
        expect(err).toBeInstanceOf(HttpErrorResponse);
        expect((err as HttpErrorResponse).status).toBe(401);
        done();
      },
    });

    controller.expectOne('/api/profile').flush(
      { message: 'Unauthorized' },
      { status: 401, statusText: 'Unauthorized' }
    );
  });
});
