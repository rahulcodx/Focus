import { verifyAuthToken } from './auth';

const TOKEN_KEY = 'auth_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  // Check cookie first
  const cookies = document.cookie.split(';').map(c => c.trim());
  const tokenCookie = cookies.find(c => c.startsWith(`${TOKEN_KEY}=`));
  if (tokenCookie) {
    return tokenCookie.split('=')[1];
  }
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`;
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export async function isAuthenticated(): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    await verifyAuthToken(token);
    return true;
  } catch {
    return false;
  }
}

export async function apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  return fetch(url, { ...options, headers });
}