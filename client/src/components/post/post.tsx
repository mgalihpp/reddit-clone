import React, { useRef } from 'react';
import PostVote from './post-vote';
import { Link, useLocation, useParams } from 'react-router-dom';
import { formatReadableCount, formatTimeToNow } from '@/lib/utils';
import EditorOutput from '@/components/editor/EditorOutput';
import { Ellipsis, MessageSquare, Share } from 'lucide-react';
import { useBreakpoints } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import UserHover from '@/components/user-hover';
import SubredditHover from '@/components/subreddit-hover';
import SubscribeBtn from '@/components/subscribe-btn';
import { useSession } from '@/providers/SessionProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type PartialVote = Pick<Vote, 'type'>;

interface PostProps {
  post: Post & {
    author: User;
    votes: Vote[];
  };
  votesAmt: number;
  subreddit: Subreddit;
  currentVote?: PartialVote;
  commentAmt: number;
}

const Post: React.FC<PostProps> = ({
  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  subreddit,
  commentAmt,
}) => {
  const session = useSession();

  const paraRef = useRef<HTMLParagraphElement>(null);

  const { isXs } = useBreakpoints();

  const { slug } = useParams();
  const { pathname } = useLocation();

  return (
    <div className="border-t py-1">
      <div className="group/post rounded-none bg-white hover:rounded-lg hover:bg-zinc-100 max-sm:bg-transparent">
        <div className="flex py-2 sm:px-6">
          <div className="w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="mt-1 flex max-h-40 items-center text-xs text-gray-500">
                {slug ? (
                  <UserHover author={post.author} />
                ) : subreddit.id ? (
                  <SubredditHover subreddit={subreddit} />
                ) : null}
                <span className="px-1">•</span>

                {formatTimeToNow(new Date(post.createdAt))}
              </div>

              <div className="flex items-center gap-2">
                {subreddit.creatorId !== session.user?.id &&
                !pathname.includes('/r/') ? (
                  <SubscribeBtn
                    isSubscribed={
                      session.user?.subscriptions.some(
                        ({ subredditId }) => subredditId === subreddit.id,
                      ) ?? false
                    }
                    subredditId={subreddit.id}
                    subredditName={subreddit.name}
                    refetch={session.refetch}
                  />
                ) : null}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="subtle"
                      className="rounded-full bg-transparent text-xs hover:bg-transparent"
                      size="xs"
                    >
                      <Ellipsis className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup className="text-lg">
                      <DropdownMenuItem className="flex w-full items-center gap-3 px-4 py-3">
                        Add to Favorites
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex w-full items-center gap-3 px-4 py-3">
                        Mute r/{subreddit.name}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Link to={`/r/${subreddit.name}/post/${post.id}`}>
              <h1 className="py-2 text-lg font-semibold leading-6 text-gray-900 max-sm:text-sm">
                {post.title}
              </h1>

              <div
                className="relative max-h-40 w-full overflow-clip text-sm max-sm:max-h-20"
                ref={paraRef}
              >
                <EditorOutput content={post.content} />
                {paraRef.current?.clientHeight === (isXs ? 80 : 160) ? (
                  // blur bottom if content is too long
                  <div className="to absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent group-hover/post:from-zinc-100"></div>
                ) : null}
              </div>
            </Link>
          </div>
        </div>
        <div className="z-20 flex gap-2 px-4 pb-2 text-sm sm:px-6">
          <PostVote
            postId={post.id}
            initialVotesAmt={_votesAmt}
            initialVote={_currentVote?.type}
          />

          <Link
            to={`/r/${subreddit.name}/post/${post.id}`}
            className="flex max-h-9 w-fit items-center gap-2 rounded-full bg-zinc-200/50 px-3 text-center text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            <MessageSquare className="size-4" />{' '}
            {formatReadableCount(commentAmt)}
          </Link>

          <Button
            variant="subtle"
            className="max-h-9 w-fit items-center gap-2 rounded-full max-sm:text-xs"
          >
            <Share className="size-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Post;
