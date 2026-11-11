import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiRequest } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('janaseva_token');
    const savedUser = localStorage.getItem('janaseva_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify with /auth/me in background
        apiRequest('/auth/me')
          .then((res) => {
            if (res.user) {
              setUser(res.user);
              localStorage.setItem('janaseva_user', JSON.stringify(res.user));
            }
          })
          .catch(() => {
            logout();
          })
          .finally(() => setLoading(false));
      } catch (e) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('janaseva_token', res.token);
      localStorage.setItem('janaseva_user', JSON.stringify(res.user));

      // Direct to respective role dashboard
      if (res.user.role === 'cmo_admin') {
        router.push('/cmo/dashboard');
      } else if (res.user.role === 'officer') {
        router.push('/officer/dashboard');
      } else {
        router.push('/citizen/dashboard');
      }
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('janaseva_token', res.token);
      localStorage.setItem('janaseva_user', JSON.stringify(res.user));
      router.push('/citizen/dashboard');
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('janaseva_token');
    localStorage.removeItem('janaseva_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

