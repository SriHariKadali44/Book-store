import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../../shared/auth/auth.service';
import { MOCK_PASSWORD, MOCK_SHOPPER } from '../../shared/auth/auth.service.mock';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => controller.verify());

  it('should NOT attach Authorization header when unauthenticated', () => {
    http.get('/api/books').subscribe();
    const req = controller.expectOne('/api/books');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('should attach Bearer token when authenticated', done => {
    authService.login(MOCK_SHOPPER.email, MOCK_PASSWORD).subscribe(() => {
      http.get('/api/books').subscribe();
      const req = controller.expectOne('/api/books');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer mock-jwt-shopper-token'
      );
      req.flush([]);
      done();
    });
  });

  it('should not mutate the original request', done => {
    authService.login(MOCK_SHOPPER.email, MOCK_PASSWORD).subscribe(() => {
      const original = new HttpRequest('GET', '/api/books');
      http.request(original).subscribe();
      const req = controller.expectOne('/api/books');
      // Interceptor clones the request — original must remain unchanged
      expect(original.headers.has('Authorization')).toBe(false);
      req.flush([]);
      done();
    });
  });
});
