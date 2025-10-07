import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPIService } from '../services/auth-api.service';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  subscribers: number;
  verified: boolean;
  joinDate: string;
  totalViews: number;
  totalVideos: number;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (userData: { username: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authAPIService.getCurrentUser();
        if (response.success && response.data?.user) {
          const userData = response.data.user;
          setUser({
            id: userData.id,
            username: userData.username,
            email: userData.email || '',
            avatar: userData.avatar || '',
            isAdmin: userData.isAdmin || false,
            subscribers: userData.subscribers || 0,
            verified: userData.verified || false,
            joinDate: userData.joinDate || new Date().toISOString(),
            totalViews: userData.totalViews || 0,
            totalVideos: userData.totalVideos || 0,
            isPremium: userData.isPremium || false
          });
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPIService.signIn(identifier, password);
      if (response.success && response.data?.user) {
        const userData = response.data.user;
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email || '',
          avatar: userData.avatar || '',
          isAdmin: userData.isAdmin || false,
          subscribers: userData.subscribers || 0,
          verified: userData.verified || false,
          joinDate: userData.joinDate || new Date().toISOString(),
          totalViews: userData.totalViews || 0,
          totalVideos: userData.totalVideos || 0,
          isPremium: userData.isPremium || false
        });
        return true;
      }
      setError('ایمیل/نام کاربری یا رمز عبور اشتباه است');
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message?.includes('Invalid') || error.message?.includes('credentials')) {
        setError('ایمیل/نام کاربری یا رمز عبور اشتباه است');
      } else if (error.message?.includes('not confirmed') || error.message?.includes('verified')) {
        setError('لطفاً حساب کاربری خود را تایید کنید');
      } else {
        setError('خطا در ورود. لطفاً دوباره تلاش کنید');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { username: string; email: string; password: string }): Promise<boolean> => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPIService.signUp(
        userData.email,
        userData.password,
        userData.username,
        userData.username
      );
      if (response.success && response.data?.user) {
        const user = response.data.user;
        setUser({
          id: user.id,
          username: user.username,
          email: user.email || '',
          avatar: user.avatar || '',
          isAdmin: user.isAdmin || false,
          subscribers: user.subscribers || 0,
          verified: user.verified || false,
          joinDate: user.joinDate || new Date().toISOString(),
          totalViews: user.totalViews || 0,
          totalVideos: user.totalVideos || 0,
          isPremium: user.isPremium || false
        });
        return true;
      }
      setError('خطا در ثبت‌نام');
      return false;
    } catch (error: any) {
      console.error('Register error:', error);
      if (error.message?.includes('already') || error.message?.includes('exists')) {
        setError('این ایمیل یا نام کاربری قبلاً ثبت شده است');
      } else if (error.message?.includes('Invalid email')) {
        setError('ایمیل نامعتبر است');
      } else if (error.message?.includes('Password')) {
        setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      } else {
        setError('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authAPIService.signOut();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};