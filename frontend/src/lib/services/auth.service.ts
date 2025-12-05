import { apiClient, tokenManager } from '../api-client';
import { API_ENDPOINTS } from '../../config/api';

// Types for auth operations
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'coach' | 'admin' | 'developer';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

// Auth service
export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    );

    // Store token after successful login
    if (response.token) {
      tokenManager.set(response.token);
    }

    return response;
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.register,
      data
    );

    // Store token after successful registration
    if (response.token) {
      tokenManager.set(response.token);
    }

    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } finally {
      // Remove token even if request fails
      tokenManager.remove();
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.auth.me);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!tokenManager.get();
  },
};
