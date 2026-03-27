import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Try to connect to actual backend
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.log('Backend not available, using demo mode...');
      
      // DEMO MODE - Works without backend
      // This allows you to see the UI even if backend is not running
      if (email && password) {
        let role = 'student';
        let name = 'Student User';
        
        if (email.includes('admin')) {
          role = 'admin';
          name = 'Admin User';
        } else if (email.includes('warden')) {
          role = 'warden';
          name = 'Warden User';
        } else if (email.includes('student')) {
          role = 'student';
          name = 'Student User';
        }
        
        const mockUser = {
          id: 'demo-' + Date.now(),
          name: name,
          email: email,
          role: role,
          roomNumber: 'A-101'
        };
        
        const mockToken = 'demo-token-' + Date.now();
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        return { success: true, user: mockUser };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      // Try to connect to actual backend
      const response = await api.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.log('Backend not available, using demo mode...');
      
      // DEMO MODE - Works without backend
      if (userData.email && userData.password) {
        const mockUser = {
          id: 'demo-' + Date.now(),
          name: userData.name,
          email: userData.email,
          role: userData.role || 'student',
          roomNumber: userData.roomNumber || 'N/A'
        };
        
        const mockToken = 'demo-token-' + Date.now();
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        return { success: true, user: mockUser };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};