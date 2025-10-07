import { supabase } from '../lib/supabase';
import type { Profile, Video, LiveStream, Wallet, Transaction } from '../lib/supabase';

// Auth API
export const authAPI = {
  signUp: async (email: string, password: string, username: string, displayName: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username,
        display_name: displayName,
      });

    if (profileError) throw profileError;

    return { success: true, data: authData };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { success: true, data };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      return { success: true, data: { user, profile } };
    }

    return { success: true, data: null };
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { success: true, data: session };
  }
};

// Videos API
export const videosAPI = {
  getVideos: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  }) => {
    let query = supabase
      .from('videos')
      .select('*, profiles(*)');

    if (params?.category) {
      query = query.eq('category', params.category);
    }

    if (params?.search) {
      query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    const sortField = params?.sort === 'views' ? 'views' : 'created_at';
    query = query.order(sortField, { ascending: false });

    const limit = params?.limit || 20;
    const page = params?.page || 1;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, data };
  },

  getVideo: async (id: string) => {
    const { data, error } = await supabase
      .from('videos')
      .select('*, profiles(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return { success: true, data };
  },

  uploadVideo: async (videoData: {
    title: string;
    description?: string;
    category: string;
    tags?: string[];
    thumbnail_url?: string;
    video_url: string;
    duration?: number;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        ...videoData,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  },

  updateVideo: async (id: string, updates: Partial<Video>) => {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  },

  deleteVideo: async (id: string) => {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  likeVideo: async (videoId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error: deleteError } = await supabase
      .from('video_interactions')
      .delete()
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .eq('interaction_type', 'dislike');

    const { error } = await supabase
      .from('video_interactions')
      .upsert({
        user_id: user.id,
        video_id: videoId,
        interaction_type: 'like',
      });

    if (error) throw error;

    const { error: updateError } = await supabase.rpc('increment_video_likes', {
      video_id: videoId,
    });

    return { success: true };
  },

  dislikeVideo: async (videoId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error: deleteError } = await supabase
      .from('video_interactions')
      .delete()
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .eq('interaction_type', 'like');

    const { error } = await supabase
      .from('video_interactions')
      .upsert({
        user_id: user.id,
        video_id: videoId,
        interaction_type: 'dislike',
      });

    if (error) throw error;

    return { success: true };
  },

  incrementViews: async (videoId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('video_interactions')
      .upsert({
        user_id: user.id,
        video_id: videoId,
        interaction_type: 'view',
      });

    if (error) throw error;

    const { error: updateError } = await supabase
      .from('videos')
      .update({ views: supabase.sql`views + 1` })
      .eq('id', videoId);

    return { success: true };
  },

  getTrending: async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*, profiles(*)')
      .order('views', { ascending: false })
      .limit(10);

    if (error) throw error;
    return { success: true, data };
  },

  getCategories: async () => {
    const categories = [
      'آموزشی',
      'سرگرمی',
      'موسیقی',
      'ورزشی',
      'خبری',
      'فناوری',
      'بازی',
      'فیلم',
      'هنری',
      'طبیعت'
    ];
    return { success: true, data: categories };
  }
};

// Users API
export const usersAPI = {
  getProfile: async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return { success: true, data };
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  },

  subscribe: async (channelId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('subscriptions')
      .insert({
        subscriber_id: user.id,
        channel_id: channelId,
      });

    if (error) throw error;
    return { success: true };
  },

  unsubscribe: async (channelId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('subscriber_id', user.id)
      .eq('channel_id', channelId);

    if (error) throw error;
    return { success: true };
  },

  getUserVideos: async (userId: string) => {
    const { data, error } = await supabase
      .from('videos')
      .select('*, profiles(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  },

  getSubscriptions: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, profiles!subscriptions_channel_id_fkey(*)')
      .eq('subscriber_id', user.id);

    if (error) throw error;
    return { success: true, data };
  },

  getUsers: async (params?: { limit?: number }) => {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('subscriber_count', { ascending: false });

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data };
  }
};

// Wallet API
export const walletAPI = {
  getBalance: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return { success: true, data };
  },

  getTransactions: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: wallet } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!wallet) throw new Error('Wallet not found');

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  },

  deposit: async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!wallet) throw new Error('Wallet not found');

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        wallet_id: wallet.id,
        type: 'deposit',
        amount,
        description: 'واریز به کیف پول',
      })
      .select()
      .single();

    if (error) throw error;

    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        balance: wallet.balance + amount,
        total_earned: wallet.total_earned + amount
      })
      .eq('id', wallet.id);

    if (updateError) throw updateError;

    return { success: true, data };
  },

  withdraw: async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!wallet) throw new Error('Wallet not found');
    if (wallet.balance < amount) throw new Error('موجودی کافی نیست');

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        wallet_id: wallet.id,
        type: 'withdraw',
        amount: -amount,
        description: 'برداشت از کیف پول',
      })
      .select()
      .single();

    if (error) throw error;

    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        balance: wallet.balance - amount,
        total_withdrawn: wallet.total_withdrawn + amount
      })
      .eq('id', wallet.id);

    if (updateError) throw updateError;

    return { success: true, data };
  },

  getStats: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!wallet) throw new Error('Wallet not found');

    return {
      success: true,
      data: {
        balance: wallet.balance,
        totalEarned: wallet.total_earned,
        totalWithdrawn: wallet.total_withdrawn
      }
    };
  }
};

// Live API
export const liveAPI = {
  getStreams: async () => {
    const { data, error } = await supabase
      .from('live_streams')
      .select('*, profiles(*)')
      .eq('status', 'live')
      .order('started_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  },

  getStream: async (id: string) => {
    const { data, error } = await supabase
      .from('live_streams')
      .select('*, profiles(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return { success: true, data };
  },

  createStream: async (streamData: {
    title: string;
    description?: string;
    category: string;
    tags?: string[];
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const streamKey = `stream_${user.id}_${Date.now()}`;

    const { data, error } = await supabase
      .from('live_streams')
      .insert({
        user_id: user.id,
        stream_key: streamKey,
        ...streamData,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  },

  startStream: async (id: string) => {
    const { data, error } = await supabase
      .from('live_streams')
      .update({
        status: 'live',
        started_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  },

  endStream: async (id: string) => {
    const { data, error } = await supabase
      .from('live_streams')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  }
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    const { data: videos } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true });

    const { data: users } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { data: streams } = await supabase
      .from('live_streams')
      .select('*', { count: 'exact', head: true });

    return {
      success: true,
      data: {
        totalVideos: videos?.length || 0,
        totalUsers: users?.length || 0,
        totalStreams: streams?.length || 0,
      }
    };
  },

  getUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  },

  updateUserStatus: async (id: string, isPremium: boolean) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_premium: isPremium })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  },

  updateVideoStatus: async (id: string, status: string) => {
    const { data, error } = await supabase
      .from('videos')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  },

  getAnalytics: async () => {
    const { data: videos } = await supabase
      .from('videos')
      .select('views, created_at');

    const totalViews = videos?.reduce((sum, video) => sum + video.views, 0) || 0;

    return {
      success: true,
      data: {
        totalViews,
        videos: videos || []
      }
    };
  }
};
