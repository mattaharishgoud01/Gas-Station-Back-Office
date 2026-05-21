import { createContext, useContext, useState, useEffect } from 'react';
import { authService, api, socket } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fuelops_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have a token but no user, we could potentially verify it here
    // For now, we'll just set a mock user if token exists to bypass full verification in UI
    if (token) {
      setUser({ role: 'admin', name: 'Authorized User' });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      socket.connect();
    }
    setLoading(false);
    
    return () => {
      socket.disconnect();
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('fuelops_token', newToken);
      setToken(newToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Invalid credentials'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('fuelops_token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
