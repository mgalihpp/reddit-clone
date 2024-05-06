import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { UserAvatar } from '@/components/user-avatar';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface UserHoverProps {
  author: User;
  children?: React.ReactNode;
  customTrigger?: boolean;
  className?: string;
}

const UserHover: React.FC<UserHoverProps> = ({
  author,
  children,
  customTrigger = false,
  className,
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
            to={`/user/${author.username}`}
            className="inline-flex items-center gap-3 text-sm text-zinc-900 underline underline-offset-2"
          >
            <UserAvatar user={author} className="size-6" />
            <span>u/{author.username}</span>
          </Link>
        )}
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex w-full items-center gap-2">
          <UserAvatar user={author} />
          <div className="flex w-full flex-col space-y-1 text-xs">
            <p className="font-semibold">{author.username}</p>
            <p>u/{author.username}</p>
            <p className="flex items-center gap-2">
              <Clock className="size-3" />
              {format(author.createdAt, 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserHover;
