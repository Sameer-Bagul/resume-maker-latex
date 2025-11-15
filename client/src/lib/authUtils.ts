// JWT Authentication utilities

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Store auth token in localStorage
export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

// Get auth token from localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Remove auth token from localStorage
export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Store user data in localStorage
export function setUser(user: any): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Get user data from localStorage
export function getUser(): any | null {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

// Check if user is authenticated (has valid token)
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Check if error is unauthorized
export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

// Add auth header to fetch requests
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`,
  };
}
