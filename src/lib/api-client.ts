// API Client utility for making authenticated requests

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get authentication headers for API requests
 */
export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth-token');
  
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

/**
 * Make an authenticated GET request
 */
export async function apiGet<T = any>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API GET error (${endpoint}):`, error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
}

/**
 * Make an authenticated POST request
 */
export async function apiPost<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API POST error (${endpoint}):`, error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
}

/**
 * Make an authenticated PUT request
 */
export async function apiPut<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API PUT error (${endpoint}):`, error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
}

/**
 * Make an authenticated DELETE request
 */
export async function apiDelete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API DELETE error (${endpoint}):`, error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth-token');
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): { name: string; email: string } | null {
  const userData = localStorage.getItem('planly_user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Logout user
 */
export function logout(): void {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('planly_user');
  // Clear cookie
  document.cookie = 'auth-token=; path=/; max-age=0';
  // Use setTimeout to avoid immediate redirect during component mount
  setTimeout(() => {
    window.location.href = '/login';
  }, 100);
}
