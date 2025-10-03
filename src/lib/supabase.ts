import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database types
export type Profile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  is_premium: boolean;
  subscriber_count: number;
  created_at: string;
  updated_at: string;
};

export type Video = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  video_url: string;
  duration: number;
  views: number;
  likes: number;
  dislikes: number;
  category: string;
  tags: string[];
  status: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
};

export type LiveStream = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  stream_key: string;
  viewers_count: number;
  category: string;
  tags: string[];
  status: string;
  started_at?: string;
  ended_at?: string;
  created_at: string;
  profiles?: Profile;
};

export type Wallet = {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_withdrawn: number;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  wallet_id: string;
  type: string;
  amount: number;
  description?: string;
  status: string;
  created_at: string;
};

export type Subscription = {
  id: string;
  subscriber_id: string;
  channel_id: string;
  created_at: string;
};

export type VideoInteraction = {
  id: string;
  user_id: string;
  video_id: string;
  interaction_type: 'like' | 'dislike' | 'view';
  created_at: string;
};
