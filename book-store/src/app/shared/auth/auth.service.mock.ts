import { User } from '../models/user.model';
import { AuthResponse } from './auth.model';

export const MOCK_SHOPPER: User = {
  id: 'user-001',
  email: 'alice@example.com',
  firstName: 'Alice',
  lastName: 'Reader',
  role: 'shopper',
  avatarUrl: undefined,
  createdAt: '2025-01-15T10:00:00Z',
};

export const MOCK_ADMIN: User = {
  id: 'user-admin-001',
  email: 'admin@bookstore.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  avatarUrl: undefined,
  createdAt: '2024-06-01T08:00:00Z',
};

export const MOCK_AUTH_RESPONSE_SHOPPER: AuthResponse = {
  accessToken: 'mock-jwt-shopper-token',
  user: MOCK_SHOPPER,
};

export const MOCK_AUTH_RESPONSE_ADMIN: AuthResponse = {
  accessToken: 'mock-jwt-admin-token',
  user: MOCK_ADMIN,
};

/** Credential pairs accepted by the mock service. */
export const MOCK_CREDENTIALS: Record<string, AuthResponse> = {
  'alice@example.com': MOCK_AUTH_RESPONSE_SHOPPER,
  'admin@bookstore.com': MOCK_AUTH_RESPONSE_ADMIN,
};

export const MOCK_PASSWORD = 'password123';
