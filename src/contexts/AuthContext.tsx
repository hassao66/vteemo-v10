import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/supabase-api';
import { supabase } from '../lib/supabase';

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
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { username: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await authAPI.getCurrentUser();
        if (data?.profile) {
          setUser({
            id: data.profile.id,
            username: data.profile.username,
            email: data.user?.email || '',
            avatar: data.profile.avatar_url || '',
            isAdmin: false,
            subscribers: data.profile.subscriber_count,
            verified: false,
            joinDate: data.profile.created_at,
            totalViews: 0,
            totalVideos: 0,
            isPremium: data.profile.is_premium
          });
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          const { data } = await authAPI.getCurrentUser();
          if (data?.profile) {
            setUser({
              id: data.profile.id,
              username: data.profile.username,
              email: data.user?.email || '',
              avatar: data.profile.avatar_url || '',
              isAdmin: false,
              subscribers: data.profile.subscriber_count,
              verified: false,
              joinDate: data.profile.created_at,
              totalViews: 0,
              totalVideos: 0,
              isPremium: data.profile.is_premium
            });
          }
        } else {
          setUser(null);
        }
      })();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authAPI.signIn(email, password);
      if (response.success) {
        const { data } = await authAPI.getCurrentUser();
        if (data?.profile) {
          setUser({
            id: data.profile.id,
            username: data.profile.username,
            email: data.user?.email || '',
            avatar: data.profile.avatar_url || '',
            isAdmin: false,
            subscribers: data.profile.subscriber_count,
            verified: false,
            joinDate: data.profile.created_at,
            totalViews: 0,
            totalVideos: 0,
            isPremium: data.profile.is_premium
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { username: string; email: string; password: string }): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authAPI.signUp(
        userData.email,
        userData.password,
        userData.username,
        userData.username
      );
      if (response.success) {
        const { data } = await authAPI.getCurrentUser();
        if (data?.profile) {
          setUser({
            id: data.profile.id,
            username: data.profile.username,
            email: data.user?.email || '',
            avatar: data.profile.avatar_url || '',
            isAdmin: false,
            subscribers: data.profile.subscriber_count,
            verified: false,
            joinDate: data.profile.created_at,
            totalViews: 0,
            totalVideos: 0,
            isPremium: data.profile.is_premium
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authAPI.signOut();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};