'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(() => {
    try {
      // Check for auth token in cookies
      const cookies = document.cookie.split(';').reduce((acc, c) => {
        const [k, v] = c.trim().split('=');
        acc[k] = v;
        return acc;
      }, {});

      const token = cookies['auth_token'] || cookies['admin_token'];
      if (token) {
        const payload = parseJwt(token);
        if (payload && payload.exp * 1000 > Date.now()) {
          setUser({
            id: payload.id || payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload.role || 'customer',
          });
        } else {
          setUser(null);
        }
      } else {
        // Check localStorage fallback (for demo mode)
        const saved = localStorage.getItem('diaa_user');
        if (saved) {
          setUser(JSON.parse(saved));
        } else {
          setUser(null);
        }
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('diaa_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('diaa_user');
    // Clear cookies
    document.cookie = 'auth_token=; path=/; max-age=0';
    document.cookie = 'admin_token=; path=/; max-age=0';
    router.refresh();
  }, [router]);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
