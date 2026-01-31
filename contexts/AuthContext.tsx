import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';
import { getPushToken, requestNotificationPermissions } from '../utils/notifications-service';

interface User {
  id: number;
  phone: string;
  name: string;
  email?: string;
  bio?: string;
  profile_image?: string;
  is_verified: boolean;
  role: string;
  created_at: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (token: string, userData: User) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@athar_auth_token';
const USER_KEY = '@athar_user_data';
const GUEST_KEY = '@athar_guest_mode';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Load saved auth data on mount
  useEffect(() => {
    loadAuthData();
  }, []);

  // Setup notifications when user logs in
  useEffect(() => {
    if (user && token && !isGuest) {
      setupNotifications();
    }
  }, [user, token, isGuest]);

  const loadAuthData = async () => {
    try {
      const guestMode = await AsyncStorage.getItem(GUEST_KEY);
      
      if (guestMode === 'true') {
        // User is in guest mode
        setIsGuest(true);
        setUser({
          id: 0,
          phone: '',
          name: 'ضيف',
          is_verified: false,
          role: 'guest',
          created_at: new Date().toISOString(),
          isGuest: true,
        });
        setIsLoading(false);
        return;
      }

      const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const savedUser = await AsyncStorage.getItem(USER_KEY);

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        
        // Verify token is still valid
        const response = await api.getCurrentUser();
        if (response.success) {
          setUser(response.data);
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data));
        } else {
          // Token invalid, clear auth
          await clearAuthData();
        }
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const setupNotifications = async () => {
    try {
      // Request permissions
      const hasPermission = await requestNotificationPermissions();
      
      if (hasPermission) {
        // Get push token
        const pushToken = await getPushToken();
        
        if (pushToken) {
          // Save push token to backend
          await api.savePushToken(pushToken);
        }
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  const login = async (authToken: string, userData: User) => {
    try {
      // Clear guest mode
      await AsyncStorage.removeItem(GUEST_KEY);
      setIsGuest(false);

      // Save to state
      setToken(authToken);
      setUser(userData);

      // Save to AsyncStorage
      await AsyncStorage.setItem(TOKEN_KEY, authToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

      // Set token for API calls
      api.setAuthToken(authToken);
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  };

  const loginAsGuest = async () => {
    try {
      // Set guest mode
      await AsyncStorage.setItem(GUEST_KEY, 'true');
      setIsGuest(true);
      setUser({
        id: 0,
        phone: '',
        name: 'ضيف',
        is_verified: false,
        role: 'guest',
        created_at: new Date().toISOString(),
        isGuest: true,
      });
    } catch (error) {
      console.error('Error setting guest mode:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clearAuthData();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const clearAuthData = async () => {
    setToken(null);
    setUser(null);
    setIsGuest(false);
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(GUEST_KEY);
    api.setAuthToken(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user && !isGuest) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    if (isGuest) return;
    
    try {
      const response = await api.getCurrentUser();
      if (response.success) {
        setUser(response.data);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: (!!user && !!token) || isGuest,
    isGuest,
    login,
    loginAsGuest,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
