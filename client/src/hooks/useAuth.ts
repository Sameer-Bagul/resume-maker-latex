// JWT Authentication Hook
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthToken, setAuthToken, removeAuthToken, setUser as setUserLocal } from "@/lib/authUtils";
import { useLocation } from "wouter";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  firstName?: string;
  lastName?: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Fetch current user
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No token found');
      }

      const res = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          removeAuthToken();
        }
        const text = await res.text();
        throw new Error(`${res.status}: ${text}`);
      }

      const data = await res.json();
      return data;
    },
    retry: false,
    enabled: !!getAuthToken(), // Only run if we have a token
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }

      return res.json();
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      setUserLocal(data.user);
      queryClient.setQueryData(["/api/auth/user"], data.user);
      setLocation('/dashboard');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
      }

      return res.json();
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      setUserLocal(data.user);
      queryClient.setQueryData(["/api/auth/user"], data.user);
      setLocation('/dashboard');
    },
  });

  // Logout function
  const logout = () => {
    removeAuthToken();
    queryClient.setQueryData(["/api/auth/user"], null);
    queryClient.clear();
    setLocation('/');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!getAuthToken(),
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegisterLoading: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
  };
}
