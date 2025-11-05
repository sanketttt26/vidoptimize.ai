import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null); // keep access token in memory only

  useEffect(() => {
    // Ensure axios sends cookies
    api.defaults.withCredentials = true;

    // Attempt to refresh access token using httpOnly refresh cookie
    const init = async () => {
      try {
        const response = await api.post('/auth/refresh');
        const { token: accessToken, user } = response.data;
        setToken(accessToken);
        setUser(user);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      } catch (err) {
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    init();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: accessToken, user } = response.data;

      setToken(accessToken);
      setUser(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token: accessToken, user } = response.data;

      setToken(accessToken);
      setUser(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore errors
    }
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
