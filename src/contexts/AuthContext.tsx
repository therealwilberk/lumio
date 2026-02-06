import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, pin: string, confirmPin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('lumio_token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        setUser(data.data);
      } else {
        localStorage.removeItem('lumio_token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('lumio_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, pin: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, pin })
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setUser(data.data.user);
        localStorage.setItem('lumio_token', data.data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (username: string, pin: string, confirmPin: string): Promise<{ success: boolean; error?: string }> => {
    if (pin !== confirmPin) {
      return { success: false, error: 'PINs do not match' };
    }
    
    if (pin.length < 4) {
      return { success: false, error: 'PIN must be at least 4 digits' };
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, pin })
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setUser(data.data.user);
        localStorage.setItem('lumio_token', data.data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Signup failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lumio_token');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
