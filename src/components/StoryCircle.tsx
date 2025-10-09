import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  hasStory: boolean;
  isViewed: boolean;
  isCurrentUser?: boolean;
}

interface StoryCircleProps {
  story: Story;
  onClick?: () => void;
}

const StoryCircle: React.FC<StoryCircleProps> = ({ story, onClick }) => {
  const gradientBorder = story.hasStory && !story.isViewed
    ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
    : 'bg-gray-600';

  const content = (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <div
        className={`relative rounded-full p-[2px] ${gradientBorder} cursor-pointer transition-transform hover:scale-105`}
        onClick={onClick}
      >
        <div className="bg-dark-primary rounded-full p-[3px]">
          {story.isCurrentUser ? (
            <div className="relative">
              <img
                src={story.avatar}
                alt={story.username}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-vitimo-500 rounded-full flex items-center justify-center border-2 border-dark-primary">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>
          ) : (
            <img
              src={story.avatar}
              alt={story.username}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
            />
          )}
        </div>
      </div>
      <span className="text-xs text-center max-w-[60px] md:max-w-[70px] truncate text-white">
        {story.isCurrentUser ? 'استوری شما' : story.username}
      </span>
    </div>
  );

  if (story.isCurrentUser) {
    return content;
  }

  return (
    <Link to={`/story/${story.userId}`}>
      {content}
    </Link>
  );
};

export default StoryCircle;
