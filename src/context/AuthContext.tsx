import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, currency?: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const profile = await api.getMe();
          setUser(profile);
        } catch {
          // Keep active demo user or clear
          const savedUser = localStorage.getItem('fintech_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        }
      } else {
        // Auto initialize demo user so user directly sees the full dashboard
        const defaultUser: User = {
          id: 'demo-user-123',
          name: 'Vikhyath Dev',
          email: 'demo@fintech.com',
          currency: '₹',
          theme: 'dark',
        };
        setUser(defaultUser);
        setToken('demo-jwt-token-active');
        localStorage.setItem('token', 'demo-jwt-token-active');
        localStorage.setItem('fintech_user', JSON.stringify(defaultUser));
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, currency = '₹') => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, password, currency);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async () => {
    await login('demo@fintech.com', 'password123');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fintech_user');
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await api.updateProfile(updates);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
