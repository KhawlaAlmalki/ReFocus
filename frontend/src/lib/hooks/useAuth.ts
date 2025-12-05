import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginCredentials, RegisterData, User } from '../services';
import { ApiError } from '../api-client';

/**
 * Hook for login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Update the user query cache with the logged-in user
      queryClient.setQueryData(['currentUser'], data.user);
    },
    onError: (error: ApiError) => {
      console.error('Login failed:', error.message);
    },
  });
}

/**
 * Hook for register mutation
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      // Update the user query cache with the registered user
      queryClient.setQueryData(['currentUser'], data.user);
    },
    onError: (error: ApiError) => {
      console.error('Registration failed:', error.message);
    },
  });
}

/**
 * Hook for logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
  });
}

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  return useQuery<User, ApiError>({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
