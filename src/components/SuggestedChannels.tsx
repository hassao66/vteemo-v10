import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ChevronLeft } from 'lucide-react';
import { usersAPI } from '../services/supabase-api';
import type { Profile } from '../lib/supabase';

const SuggestedChannels: React.FC = () => {
  const [channels, setChannels] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSuggestedChannels();
  }, []);

  const loadSuggestedChannels = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers();
      if (response.success && response.data) {
        // Get first 10 channels as suggested
        setChannels(response.data.slice(0, 10));
      }
    } catch (error) {
      console.error('Error loading suggested channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (channelId: string) => {
    try {
      const isCurrentlyFollowing = followingStates[channelId];
      
      if (isCurrentlyFollowing) {
        await usersAPI.unsubscribe(channelId);
        setFollowingStates(prev => ({ ...prev, [channelId]: false }));
      } else {
        await usersAPI.subscribe(channelId);
        setFollowingStates(prev => ({ ...prev, [channelId]: true }));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) {
    return (
      <div className="vitimo-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-32">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-2"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (channels.length === 0) {
    return null;
  }

  return (
    <div className="vitimo-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">کانالهای پیشنهادی برای شما</h2>
        <Link 
          to="/channels" 
          className="flex items-center space-x-2 text-vitimo-400 hover:text-vitimo-300 transition-colors"
        >
          <span className="text-sm font-medium">مشاهده همه</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal Scrollable Channel List */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-vitimo-600 scrollbar-track-dark-tertiary">
          {channels.map((channel) => (
            <div 
              key={channel.id}
              className="flex-shrink-0 w-32 text-center group"
            >
              {/* Avatar */}
              <Link to={`/profile/${channel.id}`} className="block">
                <div className="w-20 h-20 mx-auto mb-3 relative">
                  <img
                    src={channel.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.display_name)}&background=7c3aed&color=fff`}
                    alt={channel.display_name}
                    className="w-full h-full rounded-full object-cover border-2 border-vitimo-500 group-hover:border-vitimo-400 transition-colors"
                  />
                  {channel.is_premium && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gold-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">👑</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Channel Name */}
              <Link 
                to={`/profile/${channel.id}`}
                className="block mb-2"
              >
                <h3 className="text-sm font-medium text-white group-hover:text-vitimo-400 transition-colors truncate px-1">
                  {channel.display_name}
                </h3>
                <p className="text-xs text-text-muted truncate px-1">
                  {channel.subscriber_count || 0} دنبال‌کننده
                </p>
              </Link>

              {/* Follow Button */}
              <button
                onClick={() => handleFollow(channel.id)}
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  followingStates[channel.id]
                    ? 'bg-dark-tertiary text-text-muted hover:bg-dark-secondary'
                    : 'bg-gradient-vitimo text-white hover:shadow-vitimo'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <UserPlus className="w-3 h-3" />
                  <span>{followingStates[channel.id] ? 'دنبال شده' : 'دنبال کردن'}</span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedChannels;
