import React, { useRef } from 'react';
import PostVote from './post-vote';
import { Link, useParams } from 'react-router-dom';
import { formatReadableCount, formatTimeToNow } from '@/lib/utils';
import EditorOutput from '@/components/editor/EditorOutput';
import { MessageSquare, Share } from 'lucide-react';
import { useBreakpoints } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import UserHover from '@/components/user-hover';
import SubredditHover from '@/components/subreddit-hover';

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
  const paraRef = useRef<HTMLParagraphElement>(null);

  const { isXs } = useBreakpoints();

  const { slug } = useParams();

  return (
    <div className="rounded-md bg-white first:max-sm:border-t-0 max-sm:rounded-none max-sm:border-t-2 max-sm:bg-transparent sm:shadow">
      <div className="flex justify-between py-4 sm:px-6">
        <div className="w-0 flex-1">
          <div className="mt-1 flex max-h-40 items-center text-xs text-gray-500">
            {slug ? (
              <UserHover author={post.author} />
            ) : subreddit.id ? (
              <SubredditHover subreddit={subreddit} />
            ) : null}
            <span className="px-1">•</span>

            {formatTimeToNow(new Date(post.createdAt))}
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
                <div className="to absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
              ) : null}
            </div>
          </Link>
        </div>
      </div>
      <div className="z-20 flex gap-2 bg-gray-50 px-4 py-4 text-sm sm:px-6">
        <PostVote
          postId={post.id}
          initialVotesAmt={_votesAmt}
          initialVote={_currentVote?.type}
        />

        <Link
          to={`/r/${subreddit.name}/post/${post.id}`}
          className="flex max-h-9 w-fit items-center gap-2 rounded-full bg-zinc-100 px-3 text-center text-xs font-medium text-zinc-900 hover:bg-zinc-200"
        >
          <MessageSquare className="size-4" /> {formatReadableCount(commentAmt)}
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
  );
};

export default Post;
