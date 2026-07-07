import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { MOCK_PASSWORD, MOCK_SHOPPER, MOCK_ADMIN } from './auth.service.mock';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should start unauthenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(service.userRole()).toBeNull();
    expect(service.getAccessToken()).toBeNull();
  });

  it('should authenticate shopper on successful login', done => {
    service.login(MOCK_SHOPPER.email, MOCK_PASSWORD).subscribe(user => {
      expect(user.email).toBe(MOCK_SHOPPER.email);
      expect(user.role).toBe('shopper');
      expect(service.isAuthenticated()).toBe(true);
      expect(service.userRole()).toBe('shopper');
      expect(service.getAccessToken()).toBe('mock-jwt-shopper-token');
      done();
    });
  });

  it('should authenticate admin on successful login', done => {
    service.login(MOCK_ADMIN.email, MOCK_PASSWORD).subscribe(user => {
      expect(user.role).toBe('admin');
      expect(service.userRole()).toBe('admin');
      done();
    });
  });

  it('should emit error for wrong password', done => {
    service.login(MOCK_SHOPPER.email, 'wrong-password').subscribe({
      next: () => done.fail('Expected error but got user'),
      error: err => {
        expect(err.statusCode).toBe(401);
        expect(service.isAuthenticated()).toBe(false);
        done();
      },
    });
  });

  it('should emit error for unknown email', done => {
    service.login('nobody@test.com', MOCK_PASSWORD).subscribe({
      next: () => done.fail('Expected error but got user'),
      error: err => {
        expect(err.statusCode).toBe(401);
        done();
      },
    });
  });

  it('should clear auth state on logout', done => {
    service.login(MOCK_SHOPPER.email, MOCK_PASSWORD).subscribe(() => {
      expect(service.isAuthenticated()).toBe(true);
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.currentUser()).toBeNull();
      expect(service.getAccessToken()).toBeNull();
      done();
    });
  });

  it('should authenticate user after registration', done => {
    service
      .register({
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@test.com',
        password: 'secret',
      })
      .subscribe(user => {
        expect(user.email).toBe('bob@test.com');
        expect(service.isAuthenticated()).toBe(true);
        done();
      });
  });
});
