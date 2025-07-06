import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = api.getToken();
        if (token) {
          const user = await api.getCurrentUser();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        api.removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Signup with email and password
  async function signup(email, password) {
    try {
      const data = await api.register(email, password);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Login with email and password
  async function login(email, password) {
    try {
      const data = await api.login(email, password);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  function logout() {
    api.logout();
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
