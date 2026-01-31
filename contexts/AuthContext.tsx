
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { User } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginWithOTP: (phone: string, orderId: string, code: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  sendRegistrationOTP: (phone: string) => Promise<{ success: boolean; orderId?: string; message?: string }>;
  sendLoginOTP: (phone: string) => Promise<{ success: boolean; orderId?: string; message?: string }>;
}

interface RegisterData {
  phone: string;
  name: string;
  email?: string;
  password: string;
  orderId: string;
  code: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const isAuth = await api.isAuthenticated();
      if (isAuth) {
        const storedUser = await api.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          // Refresh user data from server
          const response = await api.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
            await AsyncStorage.setItem('@athar_user', JSON.stringify(response.data));
          }
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, password: string) => {
    try {
      const response = await api.login({ phone, password });
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message || 'فشل تسجيل الدخول' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'حدث خطأ أثناء تسجيل الدخول' };
    }
  };

  const loginWithOTP = async (phone: string, orderId: string, code: string) => {
    try {
      const response = await api.post('/auth/login-otp', { phone, orderId, code });
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message || 'فشل تسجيل الدخول' };
    } catch (error) {
      console.error('Login with OTP error:', error);
      return { success: false, message: 'حدث خطأ أثناء تسجيل الدخول' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await api.register(data);
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message || 'فشل إنشاء الحساب' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'حدث خطأ أثناء إنشاء الحساب' };
    }
  };

  const sendRegistrationOTP = async (phone: string) => {
    try {
      const response = await api.post('/auth/send-registration-otp', { phone });
      if (response.success && response.data) {
        return { success: true, orderId: response.data.orderId };
      }
      return { success: false, message: response.message || 'فشل إرسال رمز التحقق' };
    } catch (error) {
      console.error('Send registration OTP error:', error);
      return { success: false, message: 'حدث خطأ أثناء إرسال رمز التحقق' };
    }
  };

  const sendLoginOTP = async (phone: string) => {
    try {
      const response = await api.post('/auth/send-login-otp', { phone });
      if (response.success && response.data) {
        return { success: true, orderId: response.data.orderId };
      }
      return { success: false, message: response.message || 'فشل إرسال رمز التحقق' };
    } catch (error) {
      console.error('Send login OTP error:', error);
      return { success: false, message: 'حدث خطأ أثناء إرسال رمز التحقق' };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        await AsyncStorage.setItem('@athar_user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithOTP,
        register,
        logout,
        refreshUser,
        sendRegistrationOTP,
        sendLoginOTP,
      }}
    >
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
