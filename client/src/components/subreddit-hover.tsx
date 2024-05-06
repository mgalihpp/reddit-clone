import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import React from 'react';
import { SubredditAvatar } from '@/components/subreddit-avatar';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface SubredditHoverProps {
  subreddit: Subreddit;
  children?: React.ReactNode;
  customTrigger?: boolean;
  className?: string;
}

const SubredditHover: React.FC<SubredditHoverProps> = ({
  subreddit,
  className,
  children,
  customTrigger = false,
}) => {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger
        className={cn(
          'inline-flex items-center gap-3 text-sm text-zinc-900 underline underline-offset-2',
          className,
        )}
        asChild
      >
        {customTrigger ? (
          <div>{children}</div>
        ) : (
          <Link
            to={`/r/${subreddit.name}`}
            className="inline-flex items-center gap-3 text-sm text-zinc-900 underline underline-offset-2"
          >
            <SubredditAvatar subbreddit={subreddit} className="size-6" />
            <span>r/{subreddit.name}</span>
          </Link>
        )}
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex w-full flex-col items-center gap-2">
          <div className="flex w-full items-center gap-2">
            <SubredditAvatar subbreddit={subreddit} />
            <div className="flex w-full flex-col space-y-0.5 text-xs">
              <p className="font-semibold">{subreddit.name}</p>
              <p>r/{subreddit.name}</p>
              <p className="flex items-center gap-2">
                <Clock className="size-3" />
                {format(subreddit.createdAt, 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <p className="break-words text-xs">{subreddit.description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SubredditHover;
