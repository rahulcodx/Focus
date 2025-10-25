'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PublicUser } from '@/lib/models/User';
import { setStoredToken, removeStoredToken, isAuthenticated, apiRequest } from '@/lib/auth-helpers';

interface AuthContextType {
  user: PublicUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        // Fetch user data if authenticated
        await fetchUser();
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await apiRequest('/api/user/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        removeStoredToken();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      // Don't remove token on network errors, might be temporary
      if (error instanceof TypeError) {
        // Network error, keep token for retry
        setLoading(false);
        return;
      }
      removeStoredToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setStoredToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (data.success) {
        setStoredToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}