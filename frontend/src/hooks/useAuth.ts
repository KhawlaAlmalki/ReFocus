import { useState, useCallback, useEffect } from 'react';
import { authService } from '@/lib/services';
import { tokenManager } from '@/lib/api-client';

export type UserRole = 'user' | 'coach' | 'admin' | 'developer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface UseAuthReturn {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('refocus_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (tokenManager.get() && !user) {
        try {
          const currentUser = await authService.getCurrentUser();
          const mappedUser: User = {
            id: currentUser._id,
            name: currentUser.username,
            email: currentUser.email,
            role: currentUser.role as UserRole,
          };
          setUser(mappedUser);
          localStorage.setItem('refocus_user', JSON.stringify(mappedUser));
        } catch (error) {
          console.error('Failed to load user:', error);
          tokenManager.remove();
        }
      }
    };
    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    try {
      const response = await authService.login({ email, password });
      const mappedUser: User = {
        id: response.user._id,
        name: response.user.username,
        email: response.user.email,
        role: response.user.role as UserRole,
      };
      setUser(mappedUser);
      localStorage.setItem('refocus_user', JSON.stringify(mappedUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('refocus_user');
      tokenManager.remove();
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const response = await authService.register({
        username: name,
        email,
        password,
        role,
      });
      const mappedUser: User = {
        id: response.user._id,
        name: response.user.username,
        email: response.user.email,
        role: response.user.role as UserRole,
      };
      setUser(mappedUser);
      localStorage.setItem('refocus_user', JSON.stringify(mappedUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }, []);

  return {
    user,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
  };
};
