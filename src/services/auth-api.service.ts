// Custom Authentication API Service
// This replaces Supabase authentication with custom backend API

import { apiClient } from './api';

interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar: string;
  isAdmin: boolean;
  subscribers: number;
  verified: boolean;
  joinDate: string;
  totalViews: number;
  totalVideos: number;
  isPremium: boolean;
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  message?: string;
}

class AuthAPIService {
  private readonly API_URL = import.meta.env.VITE_API_URL || 'https://api.vteemo.com/api';

  /**
   * Login with email/username and password
   */
  async signIn(identifier: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success && data.data?.token) {
        // Store token in localStorage
        localStorage.setItem('authToken', data.data.token);
        apiClient.setToken(data.data.token);
      }

      return data;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Register with email
   */
  async signUp(
    email: string,
    password: string,
    username: string,
    displayName: string
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username,
          displayName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.success && data.data?.token) {
        localStorage.setItem('authToken', data.data.token);
        apiClient.setToken(data.data.token);
      }

      return data;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Register with phone (Iranian phone number)
   */
  async registerWithPhone(
    phone: string,
    otp: string,
    username: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/register/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'phone',
          phone,
          otp,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Phone registration failed');
      }

      if (data.success && data.data?.token) {
        localStorage.setItem('authToken', data.data.token);
        apiClient.setToken(data.data.token);
      }

      return data;
    } catch (error: any) {
      console.error('Register with phone error:', error);
      throw error;
    }
  }

  /**
   * Send OTP to phone number
   */
  async sendPhoneOTP(phone: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.API_URL}/auth/register/phone/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error: any) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch(`${this.API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      apiClient.setToken(null);
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<{ success: boolean; data?: { user: User; profile: User } }> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false };
      }

      const response = await fetch(`${this.API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Token is invalid, clear it
        localStorage.removeItem('authToken');
        apiClient.setToken(null);
        return { success: false };
      }

      return {
        success: true,
        data: {
          user: data.data.user,
          profile: data.data.user, // For compatibility with old code
        },
      };
    } catch (error: any) {
      console.error('Get current user error:', error);
      localStorage.removeItem('authToken');
      apiClient.setToken(null);
      return { success: false };
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<{ success: boolean; token?: string }> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false };
      }

      const response = await fetch(`${this.API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false };
      }

      if (data.success && data.data?.token) {
        localStorage.setItem('authToken', data.data.token);
        apiClient.setToken(data.data.token);
      }

      return data;
    } catch (error) {
      console.error('Refresh token error:', error);
      return { success: false };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${this.API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      return data;
    } catch (error: any) {
      console.error('Update password error:', error);
      throw error;
    }
  }
}

export const authAPIService = new AuthAPIService();
