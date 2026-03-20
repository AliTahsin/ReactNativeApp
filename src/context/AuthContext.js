import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getToken, getUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken();
        const userData = await getUser();
        if (token && userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Kullanıcı yüklenirken hata:', error);
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await apiLogin(email, password);
      if (result.success) {
        setUser(result.user);
        setShowLoginModal(false);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Bir hata oluştu!' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await apiRegister(userData);
      if (result.success) {
        setShowLoginModal(false);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Bir hata oluştu!' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const requireAuth = () => {
    if (!user) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  const isAdmin = () => {
    return user?.role === 'Admin';
  };

  if (initializing) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        showLoginModal,
        setShowLoginModal,
        login,
        register,
        logout,
        requireAuth,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
